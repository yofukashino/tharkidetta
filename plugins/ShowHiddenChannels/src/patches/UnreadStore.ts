import Patcher from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { ChannelStore, UnreadStore } from "../lib/requiredModules";
import { defaultSettings } from "../lib/consts";
import { patches } from "./index";
export default () => {
    storage.stopMarkingUnread ??= defaultSettings.stopMarkingUnread;
  const guildChannelStatePatch = Patcher.after("getGuildChannelUnreadState", UnreadStore, (args, res) => {
    return args[0]?.isHidden?.() && !storage.stopMarkingUnread ? { mentionCount: 0, hasNotableUnread: false } : res;
  });
  patches.push(guildChannelStatePatch);
  const mentionCountPatch = Patcher.after("getMentionCount", UnreadStore, (args, res) => {
    return ChannelStore.getChannel(args[0])?.isHidden?.() && !storage.stopMarkingUnread ? 0 : res;
  });
  patches.push(mentionCountPatch);
  const unreadCountPatch = Patcher.after("getUnreadCount", UnreadStore, (args, res) => {
    return ChannelStore.getChannel(args[0])?.isHidden?.() && !storage.stopMarkingUnread ? 0 : res;
  });
  patches.push(unreadCountPatch);
  const notableUnreadPatch = Patcher.after("hasNotableUnread", UnreadStore, (args, res) => {
    return storage.stopMarkingUnread ? res : res && !ChannelStore.getChannel(args[0])?.isHidden?.();
  });
  patches.push(notableUnreadPatch);
  const relevendUnreadPatch = Patcher.after("hasRelevantUnread", UnreadStore, (args, res) => {
    return storage.stopMarkingUnread ? res : res && !args[0].isHidden?.();
  });
  patches.push(relevendUnreadPatch);
  const trackedUnreadPatch = Patcher.after("hasTrackedUnread", UnreadStore, (args, res) => {
    return storage.stopMarkingUnread ? res : res && !ChannelStore.getChannel(args[0])?.isHidden?.();
  });
  patches.push(trackedUnreadPatch);
  const unreadPatch = Patcher.after("hasUnread", UnreadStore, (args, res) => {
    return storage.stopMarkingUnread ? res : res && !ChannelStore.getChannel(args[0])?.isHidden?.();
  });
  patches.push(unreadPatch);
  const unreadPinsPatch = Patcher.after("hasUnreadPins", UnreadStore, (args, res) => {
    return storage.stopMarkingUnread ? res : res && !ChannelStore.getChannel(args[0])?.isHidden?.();
  });
  patches.push(unreadPinsPatch);
};