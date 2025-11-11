import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { ThemedText } from "@/components/ThemedText";
import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Linking,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiUserConfig from "@/api/UserConfig";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { PLATFORM_TYPE, TYPE_STATUS } from "@/constants/Constants";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { Platform } from "react-native";
import { Alert } from "react-native";
import { ThemeColorsSthetic } from "@/constants/Colors";
import LoadingView from "@/components/Shared/LoadingView";

type cameraCustomProps = {
  idUser: string;
  returnBack: () => void;
};

export const CameraCustom = ({ returnBack, idUser }: cameraCustomProps) => {
  const platformOs = Platform.OS;
  const { handleNotification } = useNotificationProvider();
  const queryClient = useQueryClient();
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [imagePhoto, setImagePhoto] = useState<
    CameraCapturedPicture | undefined
  >(undefined);
  const [showRetryAgain, setShowRetryAgain] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const { mutate: savePicture } = useMutation<ResponseApi, Error, FormData>({
    mutationFn: (data: FormData) => apiUserConfig.saveProfilePicture(data),
    onSuccess: (data: ResponseApi) => handleSuccessSavePicture(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessSavePicture = (data: ObjectResponse) => {
    if (data.error) {
      handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.user.getDataUser("personal-information")],
      });
      handleNotification({
        type: TYPE_STATUS.UPDATE,
        message: data.message,
      });
      returnBack();
    }
  };

  const openSettingsMobile = () => {
    () => Linking.openSettings();
  };

  useEffect(() => {
    if (permission === null) return;

    if (!permission.granted) {
      Alert.alert(
        "Acceso a la cámara",
        "Necesitamos permiso para acceder a tu cámara y permitirte tomar fotos. Esto es por temas de seguridad para mostrarle a tus clientes quién eres y darles mayor confianza en tus servicios.",
        [
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => setShowRetryAgain(true),
          },
          { text: "Continuar", onPress: () => requestPermission() },
        ]
      );
    }
    if (permission && permission.granted) setCameraReady(true);
  }, [permission]);

  if (permission === null) return null;

  if (!permission.granted && showRetryAgain) {
    return (
      <View>
        <SubHeaderReturn subtitle="Foto de perfil" handleReturn={returnBack} />
        <View style={localStyles.container}>
          <ThemedText style={localStyles.titleRequierePermission}>
            Permiso denegado
          </ThemedText>
          <ThemedText style={localStyles.textRequieredPermision}>
            Debes habilitar el permiso manualmente en los ajustes del sistema.
          </ThemedText>
          <Button onPress={openSettingsMobile} title="Ir a ajustes" />
        </View>
      </View>
    );
  }

  if (!cameraReady) {
    return (
      <View
        style={[
          localStyles.containerPhoto,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <LoadingView />
      </View>
    );
  }

  const toogleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });
      setImagePhoto(photo);
    }
  };

  const backToTakePicture = () => {
    setImagePhoto(undefined);
  };

  const handleSavePicture = () => {
    if (imagePhoto) {
      const formData = new FormData();
      formData.append("id-user", idUser);
      formData.append("file", {
        uri: imagePhoto.uri,
        type: "image/png",
        name: `profile-picture_${Date.now()}_${idUser}.jpg`,
      } as any);

      savePicture(formData);
    }
  };

  return (
    <View>
      <SubHeaderReturn subtitle="Foto de perfil" handleReturn={returnBack} />
      <View style={localStyles.containerPhoto}>
        {imagePhoto ? (
          <View style={localStyles.containerImage}>
            <Image
              source={{ uri: imagePhoto.uri }}
              style={localStyles.imgCaptured}
            />
            <View
              style={{
                ...localStyles.btnContainerOption,
                bottom: platformOs === PLATFORM_TYPE.ANDROID ? 70 : 90,
              }}
            >
              <TouchableOpacity
                onPress={backToTakePicture}
                style={localStyles.btnOptionCamera}
              >
                <AntDesign
                  style={localStyles.icon}
                  name="close-circle"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSavePicture}
                style={localStyles.btnOptionCamera}
              >
                <AntDesign
                  style={localStyles.icon}
                  name="check-circle"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <CameraView
              ref={cameraRef}
              style={localStyles.camera}
              facing={facing}
              mirror={facing === "front"}
            />
            <View
              style={{
                ...localStyles.btnContainerOption,
                bottom: platformOs === PLATFORM_TYPE.ANDROID ? 70 : 90,
              }}
            >
              <TouchableOpacity
                style={localStyles.btnOptionCamera}
                onPress={toogleCameraFacing}
              >
                <MaterialIcons
                  style={localStyles.icon}
                  name="cameraswitch"
                  size={30}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={takePicture}
                style={localStyles.btnOptionCamera}
              >
                <Feather
                  style={localStyles.icon}
                  name="camera"
                  size={30}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  containerPhoto: {
    height: "100%",
  },
  container: {
    height: "70%",
    width: "70%",
    marginHorizontal: "auto",
    justifyContent: "center",
  },
  camera: {
    flexDirection: "row",
    justifyContent: "center",
    height: "100%",
  },
  imgCaptured: {
    width: "100%",
    height: "100%",
  },
  containerImage: {
    flexDirection: "row",
    justifyContent: "center",
    height: "100%",
  },
  btnContainerOption: {
    position: "absolute",
    flexDirection: "row",
    alignSelf: "center",
  },
  btnOptionCamera: {
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  icon: {
    alignSelf: "center",
  },
  titleRequierePermission: {
    color: ThemeColorsSthetic.textTitle,
    textAlign: "center",
    fontSize: 18,
    marginBottom: 15,
  },
  textRequieredPermision: {
    color: ThemeColorsSthetic.text,
    textAlign: "center",
    marginBottom: 15,
  },
});

export default CameraCustom;
