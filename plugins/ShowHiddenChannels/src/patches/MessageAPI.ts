import Patcher from "@vendetta/patcher";
import { ChannelStore, MessageActions } from "../lib/requiredModules";
import { patches } from "./index";
export default () => {
    const apiPatch = Patcher.instead(
    "fetchMessages",
    MessageActions,
        function (args, res) {
            if (ChannelStore.getChannel(args[0].channelId)?.isHidden?.()) return;
            return res.call(this, ...args);
        }
    );
    patches.push(apiPatch);
};
