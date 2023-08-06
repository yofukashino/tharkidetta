import Settings from "./components/Settings";
import patches from "./patches";
import * as Utils from "./lib/Utils";
export default {
    onLoad: () => {
        patches.patchAll();
        Utils.rerenderChannels();
    },
    onUnload: () => {
        patches.unpatchAll();
        Utils.rerenderChannels();
    },
    settings: Settings,
}