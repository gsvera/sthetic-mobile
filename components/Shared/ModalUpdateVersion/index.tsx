import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import {
  APP_STORE_ID,
  PACKAGE_NAME_ANDROID,
  PLATFORM_TYPE,
} from "@/constants/Constants";
import { TextStyle } from "@/constants/StyleComponents";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Linking,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type modalUpdateVersionProps = {
  open: boolean;
};

export const ModalUpdateVersion = ({ open }: modalUpdateVersionProps) => {
  const handleUpdate = () => {
    const url =
      Platform.OS === PLATFORM_TYPE.ANDROID
        ? `market://details?id=${PACKAGE_NAME_ANDROID}`
        : `itms-apps://itunes.apple.com/app/id${APP_STORE_ID}`;
    const fallbackUrl =
      Platform.OS === PLATFORM_TYPE.ANDROID
        ? `https://play.google.com/store/apps/details?id=${PACKAGE_NAME_ANDROID}`
        : `https://apps.apple.com/app/id${APP_STORE_ID}`;
    Linking.openURL(url).catch(() => Linking.openURL(fallbackUrl));
  };
  return (
    <Modal animationType="slide" transparent={true} visible={open}>
      <View style={localSyle.overlay}>
        <View style={localSyle.modal}>
          <MaterialIcons style={localSyle.icon} name="system-update" />
          <ThemedText style={localSyle.title}>
            ¡Actualización disponible!
          </ThemedText>
          <ThemedText style={localSyle.message}>
            Hay una nueva versión de la app disponible. Actualiza para
            continuar.
          </ThemedText>
          <TouchableOpacity style={localSyle.button} onPress={handleUpdate}>
            <ThemedText style={localSyle.buttonText}>
              Actualizar ahora
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const localSyle = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: ThemeColorsSthetic.shadowBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  icon: {
    fontSize: 30,
    color: ThemeColorsSthetic.update,
    marginHorizontal: "auto",
    marginVertical: 20,
  },
  title: {
    marginBottom: 10,
    ...TextStyle.title,
    textAlign: "center",
  },
  message: {
    ...TextStyle.value,
    textAlign: "justify",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: ThemeColorsSthetic.accent,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ModalUpdateVersion;
