import { constants as DiscordConstants } from "@vendetta/metro/common";
import {ChannelRecordBase, PermissionStore} from "../lib/requiredModules";
export default () => {
    const originalCan = PermissionStore?.can?.prototype?.constructor
    ChannelRecordBase.prototype.isHidden ??= function (..._args) {
      const { type } = this;
      return (
        ![1, 3].includes(type) && !originalCan?.(DiscordConstants.Permissions.VIEW_CHANNEL, this)
      );
    };
  };