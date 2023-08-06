import { React } from "@vendetta/metro/common";
import StorageUtils from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { General, Forms, Search } from "@vendetta/ui/components";
import { GuildStore, IconUtils } from "../lib/requiredModules";
import { defaultSettings } from "../lib/consts";
import * as Utils from "../lib/Utils";

const { ScrollView, Image } = General;
const { FormRow, FormSwitch } = Forms;
export default React.memo(() => {
  storage.blacklistedGuilds ??= defaultSettings.blacklistedGuilds;
  StorageUtils.useProxy(storage);
  const [query, setQuery] = React.useState([]);
  return (
    <ScrollView style={{ flex: 1 }}>
      <Search
        style={{ padding: 15 }}
        placeholder="Search guilds"
        onChangeText={(text) => setQuery(text.split(" "))}
      />
      {...Object.values(GuildStore.getGuilds())
        .filter((guild: any) =>
          query
            ? query.every((value) =>
                guild?.name?.toLowerCase().includes(value.toLowerCase())
              ) ||
              query.every((value) =>
                guild?.description?.toLowerCase().includes(value.toLowerCase())
              ) ||
              (query.some((value) =>
                guild?.name?.toLowerCase().includes(value.toLowerCase())
              ) &&
                query.some((value) =>
                  guild?.description
                    ?.toLowerCase()
                    .includes(value.toLowerCase())
                )) ||
              query.some((value) => guild?.id?.includes(value))
            : true
        )
        .sort((a: any, b: any) => a.name.localeCompare(b.name))
        .map((guild: any) => (
          <FormRow
            label={guild.name}
            subLabel={`Allows you to tap double tap on any messages to reply to them.`}
            leading={
              <Image
                style={{ borderRadius: 120, height: 24, width: 24 }}
                source={{
                  uri:
                    IconUtils.getGuildIconURL(guild) ??
                    IconUtils.getDefaultAvatarURL(Utils.randomNo(0, 69)),
                }}
              />
            }
            trailing={
              <FormSwitch
                value={storage.blacklistedGuilds[guild.id]}
                onValueChange={() => {
                  storage.blacklistedGuilds[guild.id] =
                    !storage.blacklistedGuilds[guild.id];
                    Utils.rerenderChannels();
                }}
              />
            }
          />
        ))}
    </ScrollView>
  );
});
