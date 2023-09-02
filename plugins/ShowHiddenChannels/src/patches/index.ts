import ChannelRecordBase from "./ChannelRecordBase";
import ChannelCategory from "./ChannelCategory";
import MessageAPI from "./MessageAPI";
import Permission from "./Permission";
import UnreadStore  from "./UnreadStore";
import Visuals from "./Visuals";
export const patches = [];
export default {
    patchAll: () => {
        ChannelRecordBase();
        ChannelCategory();
        MessageAPI();
        Permission();
        UnreadStore();
        Visuals();
    },
    unpatchAll: () => {
        patches.forEach(up => up?.());
        patches.length = 0;
    },
}