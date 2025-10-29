import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { apiUser } from "@/api/User";
import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";
import GeneralButton from "@/components/Shared/GeneralButton";
import LoadingView from "@/components/Shared/LoadingView";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import SuccessNotification from "@/components/Shared/Notifications/SuccessNotification";
import { ThemedText } from "@/components/ThemedText";
import { Container, ThemeColorsSthetic } from "@/constants/Colors";
import { REGEX, TYPE_STATUS } from "@/constants/Constants";
import {
  ButtonGeneralStyle,
  MarginStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { parsePasswordEncrypt } from "@/utils/GeneralUtils";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function resetPassword() {
  const { height } = Dimensions.get("window");
  const { handleNotification } = useNotificationProvider();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [requestData, setRequestData] = useState({
    email: "",
    token: "",
    password: "",
  });
  const [showError, setShowError] = useState(false);
  const [hiddenPass, setHiddenPass] = useState(true);
  const [viewNewPassword, setViewNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successNotification, setSuccessNotification] = useState(false);

  const { mutate: generateToken } = useMutation({
    mutationFn: (data: any) => apiUser.sendVerificationCode(data),
    onSuccess: (data: ResponseApi) => handleSuccessGenerateToken(data.data),
    onError: ErrorAlertMessage,
  });

  const { mutate: saveResetPassword } = useMutation({
    mutationFn: (data: any) => apiUser.saveResetPassword(data),
    onSuccess: (data: ResponseApi) => handleSuccessSaveResetPassword(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessGenerateToken = (data: ObjectResponse) => {
    if (data.error)
      return handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });
    setIsLoading(false);
    setViewNewPassword(true);
    handleNotification({ type: TYPE_STATUS.SUCCESS, message: data.message });
  };

  const handleSuccessSaveResetPassword = (data: ObjectResponse) => {
    if (data.error) {
      handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });
    } else {
      setViewNewPassword(false);
      setSuccessNotification(true);
      setTimeout(() => {
        setSuccessNotification(false);
      }, 2000);
      setTimeout(() => {
        navigation.navigate("login" as never);
      }, 2200);
    }
    setIsLoading(false);
  };

  useEffect(() => navigation.setOptions({ headerShown: false }), [navigation]);

  const handleReturn = () => {
    setIsLoading(false);
    setViewNewPassword(false);
    setTimeout(() => {
      navigation.navigate("login" as never);
    }, 200);
  };

  const handleSendRecovery = () => {
    if (!REGEX.EMAIL.test(requestData.email)) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setIsLoading(true);
    generateToken({ email: requestData.email });
  };

  const handleResetPassword = () => {
    if (!REGEX.PASSWORD.test(requestData.password)) {
      setShowError(true);
      return;
    }
    setIsLoading(true);
    const passwordEncrypt = parsePasswordEncrypt(requestData.password);
    saveResetPassword({ ...requestData, password: passwordEncrypt });
  };

  return (
    <View
      style={{
        ...Container.container,
        backgroundColor: ThemeColorsSthetic.backgroundStrong,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {successNotification ? (
        <SuccessNotification message="Se ha restablecido su contraseña correctamente" />
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              backgroundColor: ThemeColorsSthetic.backgroundLight,
              flex: 1,
            }}
          >
            <View>
              <ButtonCloseModal handleOnPress={handleReturn} />
            </View>
            <ThemedText style={localStyle.title}>
              Restablecer contraseña
            </ThemedText>
            <View>
              {!viewNewPassword ? (
                <View style={{ ...localStyle.content, height: height * 0.4 }}>
                  <View style={{ marginVertical: "auto" }}>
                    <ThemedText style={localStyle.label}>
                      Ingrese su correo electronico
                    </ThemedText>
                    <TextInput
                      style={localStyle.input}
                      keyboardType="email-address"
                      onChangeText={(e) =>
                        setRequestData((prev) => ({ ...prev, email: e }))
                      }
                    />
                    {showError && (
                      <ThemedText style={localStyle.error}>
                        Ingrese un email valido
                      </ThemedText>
                    )}
                    <GeneralButton
                      textBtn="Enviar"
                      styleText={TextStyle.fontBoldWhite}
                      styleBtn={ButtonGeneralStyle.btnSaveSthetic}
                      handleOnPress={handleSendRecovery}
                      disabledBtn={isLoading}
                    />
                    {isLoading && (
                      <View style={MarginStyle.marginT10}>
                        <LoadingView />
                      </View>
                    )}
                  </View>
                </View>
              ) : (
                <View style={{ ...localStyle.content, height: height * 0.7 }}>
                  <View style={{ marginVertical: "auto" }}>
                    <View>
                      <ThemedText style={localStyle.label}>
                        Ingrese el código de verificación
                      </ThemedText>
                      <TextInput
                        style={localStyle.input}
                        keyboardType="numeric"
                        onChangeText={(e) =>
                          setRequestData((prev) => ({ ...prev, token: e }))
                        }
                      />
                    </View>
                    <View>
                      <ThemedText style={localStyle.label}>
                        Ingrese su nueva contraseña
                      </ThemedText>
                      <View>
                        <TextInput
                          style={localStyle.input}
                          onChangeText={(e) =>
                            setRequestData((prev) => ({ ...prev, password: e }))
                          }
                          secureTextEntry={hiddenPass}
                        />
                        <TouchableOpacity
                          style={localStyle.icon}
                          onPress={() => setHiddenPass((prev) => !prev)}
                        >
                          <Ionicons
                            name={hiddenPass ? "eye-off" : "eye"}
                            size={24}
                            color="gray"
                          />
                        </TouchableOpacity>
                      </View>
                      {showError && (
                        <ThemedText style={localStyle.error}>
                          La contraseña debe incluir al menos una letra
                          mayúscula, un número y un carácter especial
                        </ThemedText>
                      )}
                      <GeneralButton
                        textBtn="Restablecer contraseña"
                        styleText={TextStyle.fontBoldWhite}
                        styleBtn={ButtonGeneralStyle.btnSaveSthetic}
                        handleOnPress={handleResetPassword}
                        disabledBtn={isLoading}
                      />
                      {isLoading && (
                        <View style={MarginStyle.marginT10}>
                          <LoadingView />
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const localStyle = StyleSheet.create({
  title: {
    color: ThemeColorsSthetic.textTitle,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    marginTop: 30,
  },
  content: {
    margin: "auto",
    width: "90%",
  },
  label: {
    ...TextStyle.label,
    textAlign: "center",
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    borderWidth: 0.5,
    borderRadius: 5,
    height: 40,
    marginBottom: 15,
    textAlign: "center",
  },
  error: {
    ...TextStyle.textError,
    textAlign: "center",
    marginBottom: 15,
  },
  icon: {
    position: "absolute",
    marginVertical: "auto",
    top: 8,
    right: 10,
  },
});
