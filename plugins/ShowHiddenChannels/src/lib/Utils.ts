import Patcher from "@vendetta/patcher";
import { common } from "@vendetta/metro";
import Utils from "@vendetta/utils";
import { DiscordConstants, ChannelStore } from "./requiredModules";
export const capitalizeFirst = (string) =>
  `${string.charAt(0).toUpperCase()}${string.substring(1).toLowerCase()}`;

export const randomNo = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const convertToHMS = (seconds) => {
  seconds = Number(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  const hDisplay = h > 0 ? `${h}${h === 1 ? " hour" : " hours"}` : "";
  const mDisplay = m > 0 ? `${m}${m === 1 ? " minute" : " minutes"}` : "";
  const sDisplay = s > 0 ? `${s}${s === 1 ? " second" : " seconds"}` : "";
  return hDisplay + mDisplay + sDisplay;
};

export const getDateFromSnowflake = (number) => {
  try {
    const id = parseInt(number, 10);
    const binary = id.toString(2).padStart(64, "0");
    const excerpt = binary.substring(0, 42);
    const decimal = parseInt(excerpt, 2);
    const unix = decimal + 1420070400000;
    return new Date(unix).toLocaleString();
  } catch (error) {
    return "(Failed to get date)";
  }
};

export const patchEmptyCategoryFunction = (categories) => {
  for (const category of categories)
      category.shouldShowEmptyCategory = () => true;
};

export const sortChannels = (category) => {
  if (!category) return;
  const channelArray = Object.values(category.channels);
  category.shownChannelIds = channelArray
    .sort((x: any, y: any) => {
      const xPos =
        x.record.position +
        (x.record.isGuildVocal() ? 1e4 : 0) +
        (x.record.isHidden() ? 1e5 : 0);
      const yPos =
        y.record.position +
        (y.record.isGuildVocal() ? 1e4 : 0) +
        (y.record.isHidden() ? 1e5 : 0);
      return xPos < yPos ? -1 : xPos > yPos ? 1 : 0;
    })
    .map((n: any) => n.id);
};

export const getHiddenChannels = (guildId) => {
  if (!guildId) return { channels: [], amount: 0 };

  const guildChannels = ChannelStore.getMutableGuildChannelsForGuild(guildId);
  const hiddenChannels = Object.values(guildChannels).filter(
    (m: any) =>
      m.isHidden() && m.type !== DiscordConstants.ChannelTypes.GUILD_CATEGORY
  );

  return { channels: hiddenChannels, amount: hiddenChannels.length };
};

export const hiddenChannelCache = {};

export const getHiddenChannelRecord = (categories, guildId) => {
  const hiddenChannels = getHiddenChannels(guildId);
  if (!hiddenChannelCache[guildId]) hiddenChannelCache[guildId] = [];

  for (const category of categories) {
    const channelRecords = Object.entries(category.channels);
    const filteredChannelRecords = channelRecords
      .map(([channelID, channelRecord]) => {
        if (hiddenChannels.channels.some((m: any) => m.id === channelID)) {
          if (!hiddenChannelCache[guildId].some((m) => m[0] === channelID))
            hiddenChannelCache[guildId].push([channelID, channelRecord]);
          return false;
        }
        return [channelID, channelRecord];
      })
      .filter(Boolean);
    category.channels = Object.fromEntries(filteredChannelRecords as []);
  }

  return {
    records: Object.fromEntries(hiddenChannelCache[guildId]),
    ...hiddenChannels,
  };
};

export const rerenderChannels = () => {
  const PermissionStoreReset = Utils.findInTree(
    common.FluxDispatcher,
    (c) =>
      c?.name === "PermissionStore" &&
      c?.actionHandler?.name === "handleConnectionOpen",
    {}
  );
  PermissionStoreReset.actionHandler();
  const ChannelListStoreReset = Utils.findInTree(
    common.FluxDispatcher,
    (c) =>
      c?.name === "ChannelListStore" &&
      c?.actionHandler?.name === "handleReset",
    {}
  );
  ChannelListStoreReset.actionHandler();
};
