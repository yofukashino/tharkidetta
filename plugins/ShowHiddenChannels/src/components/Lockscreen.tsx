import { React, stylesheet, constants } from "@vendetta/metro/common";
import { General } from "@vendetta/ui/components";
import { storage } from "@vendetta/plugin";
import {
  ThemedRolePill,
  DiscordConstants,
  BigIntUtils,
  ProfileActions,
  UserStore,
  GuildMemberStore,
  PermissionUtils,
  Parser,
} from "../lib/requiredModules";
import { defaultSettings } from "../lib/consts";
import ClickableUser from "./ClickableUser";
import * as Utils from "../lib/Utils";
const { View, Text, ScrollView, Image, Pressable } = General;

export default React.memo((props: { channel: any; guild: any }) => {
  storage.showAdmin ??= defaultSettings.showAdmin;
  storage.showPerms ??= defaultSettings.showPerms;
  const style = stylesheet.createThemedStyleSheet({
    image: {
      width: 100,
      height: 100,
      padding: 5,
      marginBottom: 15,
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        constants.ThemeColorMap?.BACKGROUND_PRIMARY ?? "#00000000",
    },
    none: {
      color: constants.ThemeColorMap?.HEADER_SECONDARY ?? "#D1D1D1",
      fontSize: 14,
      fontFamily: constants.Fonts?.PRIMARY_SEMIBOLD,
      marginLeft: 2.5,
      marginRight: 2.5,
      paddingLeft: 25,
      paddingRight: 25,
      paddingTop: 5,
      textAlign: "center",
    },
    permissionContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        constants.ThemeColorMap?.BACKGROUND_SECONDARY_ALT ?? "#00000010",
    },
    header: {
      color: constants.ThemeColorMap?.HEADER_PRIMARY ?? "#D1D1D1",
      fontFamily: constants.Fonts?.PRIMARY_SEMIBOLD,
      fontWeight: "bold",
      fontSize: 24,
    },
    description: {
      color: constants.ThemeColorMap?.HEADER_SECONDARY ?? "#D1D1D1",
      fontSize: 16,
      fontFamily: constants.Fonts?.PRIMARY_SEMIBOLD,
      marginLeft: 2.5,
      marginRight: 2.5,
      paddingLeft: 25,
      paddingRight: 25,
      paddingTop: 5,
      textAlign: "center",
    },
    topicContainer: {
      backgroundColor:
        constants.ThemeColorMap?.BACKGROUND_TERTIARY ?? "#000000F0",
      maxWidth: "90%",
    },
    topicRowContainer: {
      maxWidth: "89%",
      flexDirection: "row",    
      flexWrap: "wrap",        
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,  
    },
    topicText: {
      margin: 5,
      color: constants.ThemeColorMap?.HEADER_SECONDARY ?? "#D1D1D1",
    },
    moreInfo: {
      marginTop: 5,
    },
    permissionHeader: {
      color: constants.ThemeColorMap?.HEADER_SECONDARY ?? "#D1D1D1",
      fontSize: 16,
      fontFamily: constants.Fonts?.PRIMARY_MEDIUM,
      marginLeft: 2.5,
      marginRight: 2.5,
      paddingLeft: 25,
      paddingRight: 25,
      paddingTop: 5,
      textAlign: "center",
      marginTop: 5,
    },
    permissionHeaderBorder: {
      borderTopWidth: 1,
    },
    mentionContainer: {
      marginTop: 2.5,
      marginBottom: 2.5,
    },
    roleContainer: {
      paddingTop: 2.5,
      flexDirection: "column",
      justifyContent: "center",
    },
    tagContainer: {
      marginTop: 5,
      backgroundColor:
        constants.ThemeColorMap?.BACKGROUND_SECONDARY_ALT ?? "#00000010",
      padding: 10,
      borderRadius: 5,
      color: constants.ThemeColorMap?.HEADER_SECONDARY ?? "#D1D1D1",
    },
    tag: {
      color: constants.ThemeColorMap?.HEADER_PRIMARY ?? "#D1D1D1",
      fontFamily: constants.Fonts?.PRIMARY_SEMIBOLD,
      fontWeight: "bold",
      fontSize: 16,
      marginTop: 5,
      textAlign: "center",
      marginLeft: 2.5,
      marginRight: 2.5,
      paddingLeft: 25,
      paddingRight: 25,
    },
  });
  const [channelTopic, setChannelTopic] = React.useState(null);
  const [fullChannelTopic, setFullChannelTopic] = React.useState(false);
  const [channelSpecificRoles, setChannelSpecificRoles] = React.useState([]);
  const [adminRoles, setAdminRoles] = React.useState([]);
  const [userMentionComponents, setUserMentionComponents] = React.useState([]);
  const parseTopicElements = () => {
    const topic = Parser.parseTopic(props.channel.topic);
    const currentRow = [];
    const topicRows = [];
    
for (const topicItem of topic) {
  if (typeof topicItem === "string" && topicItem.includes("\n")) {
    const subItems = topicItem.split("\n");
    for (const subItem of subItems) {
      currentRow.push(subItem)
      topicRows.push([...currentRow]);
      currentRow.length = 0;
    }
  } else {
    currentRow.push(topicItem);
  }
}
  
    if (currentRow.length) topicRows.push(currentRow);
    if (!fullChannelTopic) topicRows.splice(2, 0, ["Click to View More..."]);
  
    const topicElements = topicRows
      .slice(0, fullChannelTopic ? topicRows.length : 3)
      .map((row, index) => (
        <View key={index} style={style.topicRowContainer}>
          {row.map((item, itemIndex) => 
            typeof item == "string" ? (<Text
              key={`${itemIndex}${index}`}
              style={
                  item === "Click to View More..."
                    ? {
                      fontWeight: "bold",
                        fontFamily: constants.Fonts?.PRIMARY_SEMIBOLD,
                        ...style.topicText,
                      }
                    : style.topicText 
              }
            >
              {item}
            </Text>
          ) : item)}
        </View>
      ));
    const topicContainer = (
      <Pressable
        accessibilityRole="button"
        style={style.container}
        onPress={() => setFullChannelTopic(!fullChannelTopic)}
        android_ripple={{
          color: "#ffffff12",
        }}
        accessibilityLabel={"Channel Topic"}
      >
        <View style={style.topicContainer}>{topicElements}</View>
      </Pressable>
    );
    
    setChannelTopic(topicContainer);
  };
  const mapChannelRoles = () => {
    const channelRoleOverwrites = Object.values(
      props.channel.permissionOverwrites
    ).filter(
      (role: any) =>
        role &&
        role?.type === 0 &&
        ((storage.showAdmin !== "false" &&
          BigIntUtils.has(
            props.guild.roles[role.id].permissions,
            DiscordConstants.Permissions.ADMINISTRATOR
          )) ||
          BigIntUtils.has(
            role.allow,
            DiscordConstants.Permissions.VIEW_CHANNEL
          ) ||
          (BigIntUtils.has(
            props.guild.roles[role.id].permissions,
            DiscordConstants.Permissions.VIEW_CHANNEL
          ) &&
            !BigIntUtils.has(
              role.deny,
              DiscordConstants.Permissions.VIEW_CHANNEL
            )))
    );

    if (!channelRoleOverwrites?.length)
      return setChannelSpecificRoles([<Text style={style.none}>None</Text>]);
    const roleComponentArray = channelRoleOverwrites.map((m: any) => (
      <ThemedRolePill guildId={props.guild.id} role={props.guild.roles[m.id]} />
    ));
    return setChannelSpecificRoles(roleComponentArray);
  };

  const mapAdminRoles = (): void => {
    if (storage.showAdmin === "false")
      return setAdminRoles([<Text style={style.none}>None</Text>]);
    const adminRoles = Object.values(props.guild.roles).filter(
      (role: any) =>
        BigIntUtils.has(
          role.permissions,
          DiscordConstants.Permissions.ADMINISTRATOR
        ) &&
        (storage.showAdmin === "include" ||
          (storage.showAdmin === "exclude" && !role.tags?.bot_id))
    );

    if (!adminRoles?.length)
      return setAdminRoles([<Text style={style.none}>None</Text>]);

    const roleComponentArray = adminRoles.map((m: any) => (
      <ThemedRolePill guildId={props.guild.id} role={props.guild.roles[m.id]} />
    ));
    return setAdminRoles(roleComponentArray);
  };

  const fetchMemberAndMap = async () => {
    const allUserOverwrites: any = Object.values(
      props.channel.permissionOverwrites
    ).filter((user: any): boolean => Boolean(user && user?.type === 1));

    for (const user of allUserOverwrites) {
      await ProfileActions.fetchProfile(user.id, {
        guildId: props.guild.id,
        withMutualGuilds: false,
      });
    }

    const filteredUserOverwrites = Object.values(
      props.channel.permissionOverwrites
    ).filter((user: any): boolean =>
      Boolean(
        PermissionUtils.can({
          permission: DiscordConstants.Permissions.VIEW_CHANNEL,
          user: UserStore.getUser(user.id),
          context: props.channel,
        }) && GuildMemberStore.isMember(props.guild.id, user.id)
      )
    );

    if (!filteredUserOverwrites?.length)
      return setUserMentionComponents([<Text style={style.none}>None</Text>]);
    const mentionArray = filteredUserOverwrites.map((m: any) => (
      <ClickableUser user={UserStore.getUser(m.id)} guild={props.guild} />
    ));

    return setUserMentionComponents(mentionArray);
  };
  React.useEffect(() => {
    parseTopicElements();
  }, [props.channel.topic, fullChannelTopic]);
  React.useEffect(() => {
    mapChannelRoles();
    mapAdminRoles();
    fetchMemberAndMap();
  }, [props.channel.id]);

  return (
    <View style={style.container}>
      <ScrollView>
        <View style={style.container}>
          <Image
            style={style.image}
            source={{
              uri: "https://tharki-god.github.io/files-random-host/unknown%20copy.png",
            }}
          />
          <Text style={style.header}>This is a hidden channel.</Text>
          <Text style={style.description}>
            You cannot see the contents of this channel.
            {props.channel.topic &&
              ` However, you may see its ${
                props.channel.type !== 15 ? "topic" : "guidelines"
              }.`}
          </Text>
          {channelTopic}
          {props.channel.lastMessageId && (
            <Text style={{ ...style.description, ...style.moreInfo }}>
              Last message sent:{" "}
              {Utils.getDateFromSnowflake(props.channel.lastMessageId)}
            </Text>
          )}
          {props.channel.rateLimitPerUser > 0 && (
            <Text style={{ ...style.description, ...style.moreInfo }}>
              Slowmode:
              {Utils.convertToHMS(props.channel.rateLimitPerUser)}
            </Text>
          )}
          {props.channel.nsfw && (
            <Text style={{ ...style.description, ...style.moreInfo }}>
              Age-Restricted Channel (NSFW) 🔞
            </Text>
          )}
          {storage.showPerms && props.channel.permissionOverwrites && (
            <View style={style.permissionContainer}>
              <Text style={style.permissionHeader}>
                Users that can see this channel:
              </Text>
              <View style={style.mentionContainer}>
                {userMentionComponents}
              </View>
              <Text
                style={{
                  ...style.permissionHeader,
                  ...style.permissionHeaderBorder,
                }}
              >
                Channel-specific roles:
              </Text>
              <View style={style.roleContainer}>{channelSpecificRoles}</View>
              {storage.showAdmin !== "false" &&
                storage.showAdmin !== "channel" && (
                  <View>
                    <Text
                      style={{
                        ...style.permissionHeader,
                        ...style.permissionHeaderBorder,
                      }}
                    >
                      Admin roles:
                    </Text>
                    <View style={style.roleContainer}>{adminRoles}</View>
                  </View>
                )}
            </View>
          )}
          {props.channel.type === 15 && props.channel.availableTags && (
            <View style={style.tagContainer}>
              <Text style={{ ...style.description, ...style.moreInfo }}>
                Forum Tags:
              </Text>
              {props.channel.availableTags &&
                props.channel.availableTags.length > 0 &&
                props.channel.availableTags.map((tag) => (
                  <Text
                    style={style.tag}
                  >{`${tag.emojiName} ${tag.name}`}</Text>
                ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
});
