import Patcher from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import {defaultSettings} from "../lib/consts";
import { PermissionStore, DiscordConstants } from "../lib/requiredModules";
import {patches} from "./index";
export default () => {
    storage.blacklistedGuilds ??= defaultSettings.blacklistedGuilds;
    storage.channels ??= defaultSettings.channels;
    const permissionPatch = Patcher.after("can", PermissionStore, function (args, res) {
    if (!args[1]?.isHidden?.()) return res;
    if (args[0] == DiscordConstants.Permissions.VIEW_CHANNEL)
        return (
            !storage.blacklistedGuilds[args[1].guild_id] &&
            storage.channels[DiscordConstants.ChannelTypes[args[1].type]]
            );       
    if (args[0] == DiscordConstants.Permissions.CONNECT) return false;
    return res;
    });
    patches.push(permissionPatch);
};
