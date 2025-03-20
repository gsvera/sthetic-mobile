import { ThemedText } from "@/components/ThemedText";
import {
  Alert,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { GlobalColors } from "@/constants/Colors";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

type uploadOptionPictureModalProps = {
  open: boolean;
  handleCloseModal: () => void;
  activeCamera: () => void;
};

export const UploadOptionPictureModal = ({
  open,
  handleCloseModal,
  activeCamera,
}: uploadOptionPictureModalProps) => {
  const [imageUri, setImageUri] = useState(null);

  const handleClose = () => {
    handleCloseModal();
  };

  const showCamera = () => {
    activeCamera();
  };

  // pendiente
  // Esta funcion es para solicitar permisos para cargar archivos desde el dispositivo
  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Por favor, otorga permisos para acceder a la galería."
      );
      return false;
    }
    return true;
  };

  // pendiente
  // Esta funcion es para cargar archivos desde el dispositivo
  const showFileManager = async () => {
    const hasPermission = await requestGalleryPermission();

    if (!hasPermission) {
      console.log("Permiso denegado");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      console.log(result);
      console.log("Imagen seleccionada:", result.assets[0].base64);
    } else {
      console.log("El usuario canceló la selección.");
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={open}>
      <View style={localStyle.centeredView}>
        <View style={localStyle.modalView}>
          <TouchableOpacity onPress={() => showFileManager()}>
            <ThemedText style={localStyle.label} darkColor="black">
              Cargar una imagen{" "}
              <Feather name="upload" size={24} color="black" />
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={showCamera}>
            <ThemedText style={localStyle.label} darkColor="black">
              Tomar una foto <Feather name="camera" size={24} color="black" />
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={localStyle.button} onPress={handleClose}>
            <ThemedText style={{ fontWeight: "bold" }}>Cerrar</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    marginBottom: 15,
  },
  button: {
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
    elevation: 2,
    backgroundColor: GlobalColors.grayColor,
  },
});

export default UploadOptionPictureModal;
