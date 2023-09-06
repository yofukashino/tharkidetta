import {
  React,
  stylesheet,
} from "@vendetta/metro/common";
import { General } from "@vendetta/ui/components";
import { semanticColors } from "@vendetta/ui";
import { storage } from "@vendetta/plugin";
import { SVG } from "../lib/requiredModules";
import { defaultSettings } from "../lib/consts";
const { View } = General;
export default React.memo((props: { height?: number; width?: number; settings?: boolean; }) => {
  storage.hiddenChannelIcon ??= defaultSettings.hiddenChannelIcon;
  storage.faded ??= defaultSettings.faded;
  const style = stylesheet.createThemedStyleSheet({
    view: {
      verticalAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 5,
    },
    svg: {color: storage.faded && !props.settings ? semanticColors?.INTERACTIVE_MUTED : semanticColors?.CHANNELS_DEFAULT}   
      
    
  });
  if (storage.hiddenChannelIcon === "lock")
    return (
      <View style={style.view}>
        <SVG.Svg
          width={props.width ?? 16}
          height={props.height ?? 16}
          viewBox="0 0 24 24"
        >
          <SVG.G stroke="none" fill={style.svg.color}>
            <SVG.Path d="M17 11V7C17 4.243 14.756 2 12 2C9.242 2 7 4.243 7 7V11C5.897 11 5 11.896 5 13V20C5 21.103 5.897 22 7 22H17C18.103 22 19 21.103 19 20V13C19 11.896 18.103 11 17 11ZM12 18C11.172 18 10.5 17.328 10.5 16.5C10.5 15.672 11.172 15 12 15C12.828 15 13.5 15.672 13.5 16.5C13.5 17.328 12.828 18 12 18ZM15 11H9V7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V11Z" />
          </SVG.G>
        </SVG.Svg>
      </View>
    );
  if (storage.hiddenChannelIcon === "eye")
    return (
      <View style={style.view}>
        <SVG.Svg
          width={props.width ?? 16}
          height={props.height ?? 16}
          viewBox="0 0 24 24"
        >
          <SVG.G stroke="none" fill={style.svg.color}>
            <SVG.Path d="M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z" />
            <SVG.Path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" />
            <SVG.Polygon points="22.6,2.7 22.6,2.8 19.3,6.1 16,9.3 16,9.4 15,10.4 15,10.4 10.3,15 2.8,22.5 1.4,21.1 21.2,1.3 " />
          </SVG.G>
        </SVG.Svg>
      </View>
    );
  return null;
});
