import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import ButtonCloseModal from "../ButtonCloseModal";
import { ThemedText } from "@/components/ThemedText";
import * as Clipboard from "expo-clipboard";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { useEffect, useState } from "react";

type modalShareAvailableProps = {
  open: boolean;
  urlToShare: string;
  handleClose: () => void;
};

export const ModalShareAvailable = ({
  open,
  urlToShare,
  handleClose,
}: modalShareAvailableProps) => {
  const [showMessageSuccess, setShowMessageSuccess] = useState(false);
  const copyText = async () => {
    await Clipboard.setStringAsync(urlToShare);
    setShowMessageSuccess(true);
  };

  useEffect(() => {
    if (showMessageSuccess) {
      setTimeout(() => setShowMessageSuccess(false), 3000);
    }
  }, [showMessageSuccess]);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={handleClose}
    >
      <View style={localStyle.modalView}>
        <View style={localStyle.modalBody}>
          <ButtonCloseModal handleOnPress={handleClose} />
          <TouchableOpacity onPress={copyText}>
            <ThemedText style={localStyle.label}>
              Tocar para copiar la url
            </ThemedText>
            <MaterialCommunityIcons
              name="content-copy"
              style={localStyle.iconCopy}
            />
          </TouchableOpacity>
          <ThemedText
            style={{ color: ThemeColorsSthetic.muted, textAlign: "center" }}
          >
            La url caducara en 24 hrs
          </ThemedText>
          {showMessageSuccess && (
            <ThemedText style={localStyle.alertCopy}>
              Url copiada en el portapapeles
            </ThemedText>
          )}
        </View>
      </View>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: ThemeColorsSthetic.shadowBackground, // <-- fondo negro con opacidad
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    width: "80%",
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  alertCopy: {
    backgroundColor: ThemeColorsSthetic.accent,
    color: ThemeColorsSthetic.textLight,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
    borderRadius: 5,
    paddingVertical: 3,
  },
  label: { color: ThemeColorsSthetic.action, textAlign: "center" },
  iconCopy: {
    color: ThemeColorsSthetic.action,
    textAlign: "center",
    marginTop: 10,
    fontSize: 24,
    marginBottom: 10,
  },
});

export default ModalShareAvailable;
