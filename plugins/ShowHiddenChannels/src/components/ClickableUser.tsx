import { React, stylesheet, constants } from "@vendetta/metro/common";
import { General } from "@vendetta/ui/components";
import { ProfileActions } from "../lib/requiredModules";
const { View, Text, Image, Pressable } = General;
export default React.memo((props: { user: any; guild: any }) => {
  const style = stylesheet.createThemedStyleSheet({
    container: {
      minHeight: 45,
      flexDirection: 'row',
      marginVertical: 10,
      justifyContent: "center",
      alignItems: 'center',
    },
    avatarContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      overflow: 'hidden',
    },
    avatar: {
      width: 42,
      height: 42,
    },
    infoContainer: {
      marginLeft: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center', // Vertically align the content of infoContainer
    },
    username: {
      color: constants.ThemeColorMap?.HEADER_SECONDARY ?? '#D1D1D1',
      fontSize: 20,
      fontWeight: 'bold',
    },
    discriminator: {
      fontSize: 16,
      color: constants.ThemeColorMap?.HEADER_SECONDARY ?? '#D1D1D1',
    },
  });
  return (
    <Pressable
      accessibilityRole="button"
      style={style.container}
      onPress={() => ProfileActions.showUserProfile({ userId: props.user.id })}
      android_ripple={{
        color: "#ffffff12",
      }}
      accessibilityLabel={props.user.username}
      accessibilityHint={"Double tap to view profile"}
    >
      <View style={style.avatarContainer}>
        <Image source={props.user.getAvatarSource()} style={style.avatar} />
      </View>
      <View style={style.infoContainer}>
        <Text style={style.username}>{props.user.username}</Text>
        {props.user.discriminator !== "0" && (
          <Text style={style.discriminator}>#{props.user.discriminator}</Text>
        )}
      </View>
    </Pressable>
  );
});
