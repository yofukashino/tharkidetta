import {
    React,
  } from "@vendetta/metro/common";
  import StorageUtils from "@vendetta/storage";
  import { storage } from "@vendetta/plugin";
  import { General, Forms } from "@vendetta/ui/components";
  import { defaultSettings } from "../lib/consts";
  import * as Utils from "../lib/Utils";
  const { ScrollView } = General;
  const { FormSwitchRow } = Forms;
  export default React.memo(() => {
    storage.channels ??= defaultSettings.channels;
    StorageUtils.useProxy(storage);    
    return (
      <ScrollView> 
        {...Object.keys(storage.channels).map((type) => (
            <FormSwitchRow
          label={`Show ${Utils.capitalizeFirst(type.split("_")[1])}${
            type.split("_").length === 3 ? ` ${Utils.capitalizeFirst(type.split("_")[2])}` : ""
          } Channels`}
          value={storage.channels[type]}
          onValueChange={(v) => (storage.channels[type] = v  && Utils.rerenderChannels())}
          note=""
        />))}
      </ScrollView>
    );
  });
  