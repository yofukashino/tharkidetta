import Patcher from "@vendetta/patcher";
import Utils from "@vendetta/utils";
import {General} from "@vendetta/ui/components"
import { storage } from "@vendetta/plugin";
import { ChannelItem,  Navigator, DrawerTabbar, SelectedGuildStore, SelectedChannelStore, ChannelStore, GuildStore, UserGuildSettingsStore} from "../lib/requiredModules";
import { defaultSettings } from "../lib/consts";
import { patches } from "./index";
import HiddenChannelIcon from "../components/HiddenChannelIcon";
import Lockscreen from "../components/Lockscreen";
import * as MyUtils from "../lib/Utils";
const {View} = General;
export const patchChannelItem = () => {
  storage.faded ??= defaultSettings.faded;
    const unpatchView  = Patcher.after(
        "render",
        View,
      function (_args, res) {
        const channelItem = Utils.findInReactTree(res, (c) => c.props?.channel && c.props?.isRulesChannel && typeof c.type.type === "function");
        if (!channelItem) return res;

        const channelItemPatch = Patcher.after('type', channelItem.type, function ([{ channel }], res) {
          if (!channel?.isHidden?.()) return res;

          const container = Utils.findInReactTree(res, (c) => c !== res && Array.isArray(c.props?.children));
          container?.props?.children?.push(<HiddenChannelIcon/>) 
  
          return res;
        });

        patches.push(channelItemPatch);

        unpatchView();
      },
    ); 

    patches.push(unpatchView);

    const channelItemPatch = Patcher.after('default', ChannelItem, function (args, res) {

      const { channel } = Utils.findInTree(args[0], (c) => c?.channel, {}) ?? {};
      if (!channel?.isHidden?.()) return res;
    
      const container = Utils.findInReactTree(res, (c) => c !== res && Array.isArray(c.props?.children));      
      container?.props?.children?.push?.(<HiddenChannelIcon/>);
      res.props.onPress = () => null;
      for (const baseChild of container.props.children) {
        if (baseChild?.props?.mode === ChannelItem.ChannelModes.LOCKED) {
          baseChild.props.mode =  storage.faded ? ChannelItem.ChannelModes.MUTED : ChannelItem.ChannelModes.DEFAULT;
          if (baseChild.props.source)
          baseChild.props.source = 169;
        }
      }

      return res;
    });

    patches.push(channelItemPatch);
  };

  export const patchUserGuildSettingsStore = (): void => {
    storage.faded ??= defaultSettings.faded;
    const getMutedChannelsPatch = Patcher.after(
      "getMutedChannels",
      UserGuildSettingsStore,      
      (args, res) => {
        if (!storage.faded) return res;
        const HiddenChannelIDs = MyUtils.getHiddenChannels(args[0]).channels.map((c: any) => c.id);
        return new Set([...res, ...HiddenChannelIDs]);
      },
    );
    patches.push(getMutedChannelsPatch); 
    const isChannelMutedPatch = Patcher.after(
      "isChannelMuted",
      UserGuildSettingsStore,      
      (args, res) => {
        const Channel = ChannelStore.getChannel(args[1]);
        if (!storage.faded || !Channel?.isHidden()) return res;
        return true;
      },
    );
    patches.push(isChannelMutedPatch); 
  };
  export const patchRoute = () => {

    const navigatorPatch = Patcher.after('default', Navigator, function (_args, res) {
      
      const currentGuildId = SelectedGuildStore.getGuildId();
      const currentChannelId = SelectedChannelStore.getChannelId(currentGuildId);
      const currentChannel = ChannelStore.getChannel(currentChannelId);
      const screens = Utils.findInTree(res, (c) => c?.CHANNEL?.headerRight, {});
      if (currentChannel?.isHidden?.() && screens?.CHANNEL) {
        screens.CHANNEL.headerRight = () => null;
        screens.CHANNEL.headerTitle = () => null;
        screens.CHANNEL.render = () => <Lockscreen      
        channel={currentChannel}
        guild={GuildStore.getGuild(currentChannel.guild_id)}      
    />;
      }     
      return res;
    });
    patches.push(navigatorPatch); 




    const unpatchDrawerTabbar = Patcher.after('default', DrawerTabbar, function (_args, res) {

      const MainDrawersComponent = Utils.findInReactTree(res, (c) => c?.props?.guildId && c?.props?.channelId && typeof c?.type?.type === "function");    

      if (!MainDrawersComponent?.type) return res;
      const mainDrawersComponentPatch = Patcher.after('type', MainDrawersComponent.type, function ([{channelId}], res) {

        const channel = ChannelStore.getChannel(channelId);
        if (channel?.isHidden?.()) {
          res.props.hasMembersDrawer = false;
        }    

    return res;
  });

  patches.push(mainDrawersComponentPatch); 

  unpatchDrawerTabbar();
  return res;
  });


  }
export default () => {
  patchChannelItem();
  patchUserGuildSettingsStore();
  patchRoute();  
  };