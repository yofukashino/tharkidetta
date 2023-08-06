import { React, NavigationNative } from "@vendetta/metro/common";
import Assets from "@vendetta/ui/assets";
import { General, Forms } from "@vendetta/ui/components";
import GeneralSettings from "./GeneralSettings";
import ChannelTypes from "./ChannelTypes";
import SearchableGuilds from "./SearchableGuilds";
const { BundleUpdaterManager } = window.nativeModuleProxy ?? {};
const { ScrollView } = General;
const { FormRow } = Forms;
export default React.memo(() => {
  const navigation = NavigationNative.useNavigation();
  return (
    <ScrollView>
      <FormRow
        label={"General Settings"}
        leading={
          <FormRow.Icon source={Assets.getAssetIDByName("ic_settings")} />
        }
        trailing={() => <FormRow.Arrow />}
        onPress={() =>
          navigation.push("VendettaCustomPage", {
            title: "General Settings",
            render: GeneralSettings,
          })
        }
      />
      <FormRow
        label={"Choose what channels you want to display"}
        leading={
          <FormRow.Icon
            source={Assets.getAssetIDByName("ic_forum_channel_locked")}
          />
        }
        trailing={() => <FormRow.Arrow />}
        onPress={() =>
          navigation.push("VendettaCustomPage", {
            title: "Choose what channels you want to display",
            render: ChannelTypes,
          })
        }
      />
      <FormRow
        label={"Guilds Blacklist"}
        leading={
          <FormRow.Icon
            source={Assets.getAssetIDByName("ic_guild_grid_24px")}
          />
        }
        trailing={() => <FormRow.Arrow />}
        onPress={() =>
          navigation.push("VendettaCustomPage", {
            title: "Guilds Blacklist",
            render: SearchableGuilds,
          })
        }
      />
      <FormRow
        label="Reload Discord"
        leading={
          <FormRow.Icon source={Assets.getAssetIDByName("ic_message_retry")} />
        }
        onPress={() => BundleUpdaterManager.reload()}
      />
    </ScrollView>
  );
});
