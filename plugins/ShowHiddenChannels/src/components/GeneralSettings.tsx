import { React } from "@vendetta/metro/common";
import StorageUtils from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import Assets from "@vendetta/ui/assets";
import { General, Forms } from "@vendetta/ui/components";
import { defaultSettings } from "../lib/consts";
import HiddenChannelIcon from "./HiddenChannelIcon";
import * as Utils from "../lib/Utils";
const { ScrollView } = General;
const { FormRow, FormRadioRow, FormSwitchRow } = Forms;
export default React.memo(() => {
  storage.hiddenChannelIcon ??= defaultSettings.hiddenChannelIcon;
  storage.faded ??= defaultSettings.faded;
  storage.sort ??= defaultSettings.sort;
  storage.showPerms ??= defaultSettings.showPerms;
  storage.showAdmin ??= defaultSettings.showAdmin;
  storage.stopMarkingUnread ??= defaultSettings.stopMarkingUnread;
  storage.alwaysCollapse ??= defaultSettings.alwaysCollapse;
  storage.shouldShowEmptyCategory ??= defaultSettings.shouldShowEmptyCategory;
  StorageUtils.useProxy(storage);
  return (
    <ScrollView>
      <FormRow
        label="Hidden Channel Icon"
        subLabel="What icon to show as indicator for hidden channels."
        leading={
          <HiddenChannelIcon
            width={24}
            height={24}
            key={storage.hiddenChannelIcon}
          />
        }
      />
      <FormRadioRow
        label="Lock Icon"
        onPress={() => {
          storage.hiddenChannelIcon = "lock";
          Utils.rerenderChannels();
        }}
        trailing={<FormRow.Arrow />}
        selected={storage.hiddenChannelIcon === "lock"}
        style={{ marginHorizontal: 12 }}
      />
      <FormRadioRow
        label="Eye Icon"
        onPress={() => {
          storage.hiddenChannelIcon = "eye";
          Utils.rerenderChannels();
        }}
        trailing={<FormRow.Arrow />}
        selected={storage.hiddenChannelIcon === "eye"}
        style={{ marginHorizontal: 12 }}
      />
      <FormRadioRow
        label="None"
        onPress={() => {
          storage.hiddenChannelIcon = "false";
          Utils.rerenderChannels();
        }}
        trailing={<FormRow.Arrow />}
        selected={storage.hiddenChannelIcon === "false"}
        style={{ marginHorizontal: 12 }}
      />
      <FormSwitchRow
        label="Faded Channel"
        subLabel="Fade away hidden channel like if they are muted."
        value={storage.faded}
        onValueChange={(v) => {
          storage.faded = v;
          Utils.rerenderChannels();
        }}
        note=""
      />

      <FormRow
        label="Sorting Order"
        subLabel="Where to display Hidden Channels."
        leading={
          <FormRow.Icon
            source={Assets.getAssetIDByName("ic_forum_channel_sort_order_24px")}
          />
        }
      />
      <FormRadioRow
        label="Hidden Channels in the native Discord order (default)"
        onPress={() => {
          storage.sort = "native";
          Utils.rerenderChannels();
        }}
        trailing={<FormRow.Arrow />}
        selected={storage.sort === "native"}
        style={{ marginHorizontal: 12 }}
      />
      <FormRadioRow
        label="Hidden Channels at the bottom of the Category"
        onPress={() => {
          storage.sort = "bottom";
          Utils.rerenderChannels();
        }}
        trailing={<FormRow.Arrow />}
        selected={storage.sort === "bottom"}
        style={{ marginHorizontal: 12 }}
      />
      <FormRadioRow
        label="Hidden Channels in a separate Category at the bottom"
        onPress={() => {
          storage.sort = "extra";
          Utils.rerenderChannels();
        }}
        trailing={<FormRow.Arrow />}
        selected={storage.sort === "extra"}
        style={{ marginHorizontal: 12 }}
      />

      <FormSwitchRow
        label="Show Permissions"
        subLabel="Show what roles/users can access the hidden channel."
        value={storage.showPerms}
        onValueChange={(v) => {
          storage.showPerms = v;
          Utils.rerenderChannels();
        }}
        note=""
      />
      <FormRow
        label="Show Admin Roles"
        subLabel="Show roles that have ADMINISTRATOR permission in the hidden channel page (requires 'Shows Permission' enabled)."
        leading={
          <FormRow.Icon
            source={Assets.getAssetIDByName("ic_progress_wrench_24px")}
          />
        }
      />
      <FormRadioRow
        label="Show only channel specific roles"
        onPress={() => {
          storage.showAdmin = "channel";
          Utils.rerenderChannels();
        }}
        trailing={<FormRow.Arrow />}
        selected={storage.showAdmin === "channel"}
        style={{ marginHorizontal: 12 }}
      />
      <FormRadioRow
        label="Include Bot Roles"
        onPress={() => {
          storage.showAdmin = "include";
          Utils.rerenderChannels();
        }}
        trailing={<FormRow.Arrow />}
        selected={storage.showAdmin === "include"}
        style={{ marginHorizontal: 12 }}
      />
      <FormRadioRow
        label="Exclude Bot Roles"
        onPress={() => {
          storage.showAdmin = "exclude";
          Utils.rerenderChannels();
        }}
        trailing={<FormRow.Arrow />}
        selected={storage.showAdmin === "exclude"}
        style={{ marginHorizontal: 12 }}
      />
      <FormRadioRow
        label="Don't Show Administrator Roles"
        onPress={() => {
          storage.showAdmin = "false";
          Utils.rerenderChannels();
        }}
        trailing={<FormRow.Arrow />}
        selected={storage.showAdmin === "false"}
        style={{ marginHorizontal: 12 }}
      />

      <FormSwitchRow
        label="Stop marking hidden channels as read"
        subLabel="Stops the plugin from marking hidden channels as read."
        value={storage.stopMarkingUnread}
        onValueChange={(v) => {
          storage.stopMarkingUnread = v;
          Utils.rerenderChannels();
        }}
        note=""
      />

      <FormSwitchRow
        label="Collapse Hidden Category"
        subLabel="Collapse hidden category by default (requires sorting order as extra category)."
        value={storage.alwaysCollapse}
        onValueChange={(v) => {
          storage.alwaysCollapse = v;
          Utils.rerenderChannels();
        }}
        note=""
      />

      <FormSwitchRow
        label="Show Empty Category"
        subLabel="Show Empty Category either because there were no channels in it or all channels are under hidden channels category."
        value={storage.shouldShowEmptyCategory}
        onValueChange={(v) => {
          storage.shouldShowEmptyCategory = v;
          Utils.rerenderChannels();
        }}
        note=""
      />
    </ScrollView>
  );
});
