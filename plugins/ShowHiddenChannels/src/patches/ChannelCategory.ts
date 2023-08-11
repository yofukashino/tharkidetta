import Patcher from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import {
  CategoryStore,
  ChannelStore,
  DiscordConstants,
  GuildChannelsStore,
  ChannelRecordBase,
  ChannelListStore,
} from "../lib/requiredModules";
import { defaultSettings } from "../lib/consts";
import { patches } from "./index";
import * as MyUtils from "../lib/Utils";

export default () => {
  storage.alwaysCollapse ??= defaultSettings.alwaysCollapse;
  storage.sort ??= defaultSettings.sort;
  storage.blacklistedGuilds ??= defaultSettings.blacklistedGuilds;
  storage.shouldShowEmptyCategory ??= defaultSettings.shouldShowEmptyCategory;



  const isCollapsedPatch = Patcher.after(
    "isCollapsed",
    CategoryStore,
    (args, res) => {
      if (!args[0]?.endsWith("hidden") || !storage.alwaysCollapse) return res;
      return storage.alwaysCollapse && res;
    }
  );

  patches.push(isCollapsedPatch);

  const guildChannelsStorePatch = Patcher.after(
    "getChannels",
    GuildChannelsStore,
    (args, res) => {
      const GuildCategories = res[DiscordConstants.ChannelTypes.GUILD_CATEGORY];
      const hiddenId = `${args[0]}_hidden`;
      const hiddenCategory = GuildCategories?.find(
        (m: any) => m.channel.id == hiddenId
      );
      if (!hiddenCategory) return res;
      const noHiddenCats = GuildCategories.filter(
        (m: any) => m.channel.id !== hiddenId
      );
      const newComprator =
        (
          noHiddenCats[noHiddenCats.length - 1] || {
            comparator: 0,
          }
        ).comparator + 1;
      Object.defineProperty(hiddenCategory.channel, "position", {
        value: newComprator,
        writable: true,
      });
      Object.defineProperty(hiddenCategory, "comparator", {
        value: newComprator,
        writable: true,
      });
      return res;
    }
  );

  patches.push(guildChannelsStorePatch);

  const channelStorePatch = Patcher.after("getChannel", ChannelStore, (args, res) => {
    if (
      storage.sort !== "extra" || storage.blacklistedGuilds[
        args[0]?.replace("_hidden", "")
      ] ||
      !args[0]?.endsWith("_hidden")
    )
      return res;
    const HiddenCategoryChannel = new ChannelRecordBase({
      guild_id: args[0]?.replace("_hidden", ""),
      id: args[0],
      name: "Hidden Channels",
      type: DiscordConstants.ChannelTypes.GUILD_CATEGORY,
    });
    return HiddenCategoryChannel;
  });

  patches.push(channelStorePatch);

  const guildChannelsChannelStorePatch = Patcher.after(
    "getMutableGuildChannelsForGuild",
    ChannelStore,
    (args, res) => {
      if (storage.sort !== "extra" || storage.blacklistedGuilds[args[0]])
        return res;
      const hiddenId = `${args[0]}_hidden`;
      const HiddenCategoryChannel = new ChannelRecordBase({
        guild_id: args[0],
        id: hiddenId,
        name: "Hidden Channels",
        type: DiscordConstants.ChannelTypes.GUILD_CATEGORY,
      });
      const GuildCategories = GuildChannelsStore.getChannels(args[0])[
        DiscordConstants.ChannelTypes.GUILD_CATEGORY
      ];
      Object.defineProperty(HiddenCategoryChannel, "position", {
        value:
          (
            GuildCategories[GuildCategories.length - 1] || {
              comparator: 0,
            }
          ).comparator + 1,
        writable: true,
      });
      if (!res[hiddenId]) res[hiddenId] = HiddenCategoryChannel;
      return res;
    }
  );

  patches.push(guildChannelsChannelStorePatch);

  //* Custom category or sorting order
  const channelListStoreGetGuildPatch = Patcher.after(
    "getGuild",
    ChannelListStore,
    (args, res) => {
      if (storage.blacklistedGuilds[args[0]]) return res;
      switch (storage.sort) {
        case "bottom": {
          MyUtils.sortChannels(res.guildChannels.favoritesCategory);
          MyUtils.sortChannels(res.guildChannels.recentsCategory);
          MyUtils.sortChannels(res.guildChannels.noParentCategory);
          for (const id in res.guildChannels.categories) {
            MyUtils.sortChannels(res.guildChannels.categories[id]);
          }
          break;
        }

        case "extra": {
          const hiddenId = `${args[0]}_hidden`;
          const HiddenCategory = res.guildChannels.categories[hiddenId];
          const hiddenChannels = MyUtils.getHiddenChannelRecord(
            [
              res.guildChannels.favoritesCategory,
              res.guildChannels.recentsCategory,
              res.guildChannels.noParentCategory,
              ...Object.values(res.guildChannels.categories).filter(
                (m: any) => m.id !== hiddenId
              ),
            ],
            args[0]
          );

          HiddenCategory.channels = Object.fromEntries(
            Object.entries(hiddenChannels.records).map(([id, channel]) => {
              channel.category = HiddenCategory;
              return [id, channel];
            })
          );
            
          HiddenCategory.isCollapsed = Boolean(res.guildChannels.collapsedCategoryIds[hiddenId]);
          HiddenCategory.shownChannelIds = res.guildChannels.collapsedCategoryIds[hiddenId] || HiddenCategory.isCollapsed
              ? []
              : hiddenChannels.channels
                  .sort((x: any, y: any) => {
                    const xPos = x.position + (x.isGuildVocal() ? 1e4 : 1e5);
                    const yPos = y.position + (y.isGuildVocal() ? 1e4 : 1e5);
                    return xPos < yPos ? -1 : xPos > yPos ? 1 : 0;
                  })
                  .map((m: any) => m.id);

                
          break;
        }
      }

      if (storage.shouldShowEmptyCategory) {
        MyUtils.patchEmptyCategoryFunction([
          ...Object.values(res.guildChannels.categories).filter(
            (m: any) => !m.id.includes("hidden")
          ),
        ]);
      }

      return res;
    }
  );

  patches.push(channelListStoreGetGuildPatch);
  
};
