import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { PLATFORM_TYPE, TYPE_STATUS } from "@/constants/Constants";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  View,
} from "react-native";

export type miniNotificationProps = {
  open: boolean;
  type: TYPE_STATUS.SUCCESS | TYPE_STATUS.UPDATE | TYPE_STATUS.ERROR;
  message?: string;
};

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function MiniNotification({
  open,
  type,
  message,
}: miniNotificationProps) {
  const [bgColor, setBgColor] = useState("");
  const [icon, setIcon] = useState<ReactNode>();
  const translateY = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (open) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: -SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [open]);

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
    <View style={localStyle.toast}>
      <Animated.View style={[{ transform: [{ translateY }] }]}>
        <View
          style={{
            ...localStyle.backgroundContent,
            backgroundColor: bgColor,
          }}
        >
          <View>{icon}</View>
          <View style={{ marginLeft: 10 }}>
            <ThemedText style={localStyle.textNotification}>
              {message}
            </ThemedText>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const localStyle = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 9999, // asegúrate de que esté por encima
  },
  backgroundContent: {
    borderRadius: 5,
    maxWidth: "100%",
    top: Platform.OS === PLATFORM_TYPE.IOS ? 50 : 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    right: 10,
    left: 10,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  textNotification: {
    fontSize: 17,
    color: ThemeColorsSthetic.textLight,
  },
});
