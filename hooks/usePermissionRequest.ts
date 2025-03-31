import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

/**
 * Function to request permission to open gallery
 * 
 * @returns boolean
 */
export const requestGalleryPermission = async () => {
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
