import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { ThemedText } from "@/components/ThemedText";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiUserConfig from "@/api/UserConfig";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { TYPE_STATUS } from "@/constants/Constants";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";

type cameraCustomProps = {
  idUser: string;
  returnBack: () => void;
};

export const CameraCustom = ({ returnBack, idUser }: cameraCustomProps) => {
  const { handleNotification } = useNotificationProvider();
  const queryClient = useQueryClient();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [imageBase64, setImageBase64] = useState<string | undefined>("");

  const { mutate: savePicture } = useMutation({
    mutationFn: (data: any) => apiUserConfig.saveProfilePicture(data),
    onSuccess: (data: ResponseAPi) => handleSuccessSavePicture(data.data),
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

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={localStyles.container}>
        <ThemedText>Se requieren permisos</ThemedText>
        <Button onPress={requestPermission} title="Otorgar permisos" />
      </View>
    );
  }

  const toogleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
      });
      setImageBase64(`data:image/png;base64,${photo?.base64}`);
    }
  };

  const backToTakePicture = () => {
    setImageBase64("");
  };

  const handleSavePicture = () => {
    savePicture({ id: idUser, profilePictureB64: imageBase64 });
  };

  return (
    <View>
      <SubHeaderReturn subtitle="Foto de perfil" handleReturn={returnBack} />
      <View style={localStyles.container}>
        {imageBase64 ? (
          <View style={localStyles.containerImage}>
            <Image
              source={{ uri: imageBase64 }}
              style={localStyles.imgCaptured}
            />
            <View style={localStyles.btnContainerOption}>
              <TouchableOpacity
                onPress={backToTakePicture}
                style={localStyles.btnOptionCamera}
              >
                <AntDesign
                  style={localStyles.icon}
                  name="closecircleo"
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
                  name="checkcircleo"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <CameraView
            ref={cameraRef}
            style={localStyles.camera}
            facing={facing}
            mirror={facing === "front"}
          >
            <View style={localStyles.btnContainerOption}>
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
          </CameraView>
        )}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    height: "90%",
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
    bottom: 70,
    flexDirection: "row",
    alignContent: "flex-end",
    alignSelf: "flex-end",
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
});

export default CameraCustom;
