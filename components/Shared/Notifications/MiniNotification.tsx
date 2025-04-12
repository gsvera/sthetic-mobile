import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { TYPE_STATUS } from "@/constants/Constants";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { ReactNode, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export type miniNotificationProps = {
  type: TYPE_STATUS.SUCCESS | TYPE_STATUS.UPDATE | TYPE_STATUS.ERROR;
  message?: string;
};

export default function MiniNotification({
  type,
  message,
}: miniNotificationProps) {
  const [bgColor, setBgColor] = useState("");
  const [icon, setIcon] = useState<ReactNode>();

  useEffect(() => {
    switch (type) {
      case TYPE_STATUS.SUCCESS: {
        setBgColor(ThemeColorsSthetic.successNotification);
        setIcon(<Entypo name="check" size={20} color="white" />);
        break;
      }
      case TYPE_STATUS.UPDATE: {
        setBgColor(ThemeColorsSthetic.updateNotification);
        setIcon(
          <MaterialIcons
            name="published-with-changes"
            size={20}
            color="white"
          />
        );
        break;
      }
      case TYPE_STATUS.ERROR: {
        setBgColor(ThemeColorsSthetic.errorNotification);
        setIcon(<AntDesign name="closecircleo" size={20} color="white" />);
        break;
      }
    }
  }, [type]);

  return (
    <View style={{ ...localStyle.backgroundContent, backgroundColor: bgColor }}>
      <View>{icon}</View>
      <View style={{ marginLeft: 10 }}>
        <ThemedText style={{ fontSize: 17 }}>{message}</ThemedText>
      </View>
    </View>
  );
}

const localStyle = StyleSheet.create({
  backgroundContent: {
    borderRadius: 5,
    maxWidth: "100%",
    top: 40,
    paddingVertical: 15,
    paddingHorizontal: 15,
    right: 10,
    left: 10,
    position: "absolute",
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
