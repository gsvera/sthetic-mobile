import { ThemedText } from "@/components/ThemedText";
import { loginStyle, ThemeColorsSthetic } from "@/constants/Colors";
import { Link, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { apiUser } from "@/api/User";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { KEY_STORE, setStoreSession } from "@/hooks/StoreDataSecure";
import { useApiProvider } from "@/provider/InterceptorProvider";
import { parsePasswordEncrypt } from "@/utils/GeneralUtils";
import { loginData } from "@/constants/GeneralTypes";
import { Ionicons } from "@expo/vector-icons";
import {
  ButtonGeneralStyle,
  MarginStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import GeneralButton from "@/components/Shared/GeneralButton";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import LoadingView from "@/components/Shared/LoadingView";
import {
  imageBg,
  PLATFORM_TYPE,
  VERSION_ANDROID,
  VERSION_IOS,
} from "@/constants/Constants";

const schema = yup.object({
  username: yup.string().required("Ingrese un usuario valid"),
  password: yup.string().required("Ingrese su contraseña"),
});

export default function Login() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { setToken, token } = useApiProvider();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [hiddenPass, setHiddenPass] = useState(true);
  const [loadingSession, setLoadingSession] = useState(false);

  const { mutate: login } = useMutation({
    mutationFn: (data: loginData) => apiUser.login(data),
    onSuccess: (data: ResponseApi) => handleSuccessLogin(data.data),
    onError: (error: any) => handleError(error),
  });

  const handleSuccessLogin = (data: ObjectResponse) => {
    if (data.error) {
      setLoadingSession(false);
      ErrorAlertMessage({ message: data.message });
      return;
    }
    setStoreSession({
      key: KEY_STORE.userToken,
      value: data.items?.token,
    });
    setStoreSession({
      key: KEY_STORE.idUser,
      value: data.items?.idUser,
    });
    setToken(data.items?.token);
    setTimeout(() => {
      setLoadingSession(false);
      navigation.navigate("(tabs)" as never);
    }, 1500);
  };

  const handleError = (error: any) => {
    setLoadingSession(false);
    ErrorAlertMessage({
      message:
        "Hubo un problema al querer inciar sesión, por favor intentelo mas tarde",
    });
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (token) {
      setLoadingSession(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "(tabs)" as never }],
      });
    }
  }, [token]);

  const onSubmit = (data: loginData) => {
    setToken(null);
    setLoadingSession(true);
    const passwordEncrypt = parsePasswordEncrypt(data.password);
    login({ ...data, password: passwordEncrypt, isProvider: true });
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor:
          colorScheme === "dark"
            ? ThemeColorsSthetic.backgroundStrong
            : ThemeColorsSthetic.backgroundLight,
      }}
    >
      <ImageBackground source={imageBg} style={styles.imgBg} resizeMode="cover">
        <View
          style={
            isKeyboardVisible ? styles.withKeyboard : styles.withoutKeyboard
          }
        >
          <ScrollView style={{ flexGrow: 1 }}>
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View>
                <View style={styles.imgContainer}>
                  <Image
                    source={require("@/assets/images/meredith-aesthetic-work.png")}
                    style={styles.logo}
                  />
                </View>
                <View style={styles.centerInput}>
                  <ThemedText style={styles.label}>Usuario</ThemedText>
                  <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={{ ...loginStyle.input, ...TextStyle.value }}
                        placeholder="Ingrese su usuario"
                        placeholderTextColor={ThemeColorsSthetic.muted}
                        keyboardType="email-address"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  {errors.username && (
                    <ThemedText
                      style={{ color: ThemeColorsSthetic.dangerColor }}
                    >
                      {errors.username.message}
                    </ThemedText>
                  )}
                </View>
                <View style={styles.centerInput}>
                  <ThemedText style={styles.label}>Contraseña</ThemedText>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={{ flexDirection: "row" }}>
                        <TextInput
                          style={{ ...loginStyle.input, ...TextStyle.value }}
                          placeholder="Ingrese su contraseña"
                          placeholderTextColor={ThemeColorsSthetic.muted}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          secureTextEntry={hiddenPass}
                        />
                        <TouchableOpacity
                          style={styles.icon}
                          onPress={() => setHiddenPass((prev) => !prev)}
                        >
                          <Ionicons
                            name={hiddenPass ? "eye-off" : "eye"}
                            size={24}
                            color="gray"
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>
                <View
                  style={{
                    ...loginStyle.centerInput,
                    ...loginStyle.buttonSubmit,
                  }}
                >
                  <GeneralButton
                    textBtn="Iniciar sesión"
                    styleBtn={ButtonGeneralStyle.btnSaveSthetic}
                    styleText={TextStyle.fontBoldWhite}
                    handleOnPress={handleSubmit(onSubmit)}
                    disabledBtn={loadingSession}
                  />
                  {loadingSession && <LoadingView />}
                  <View style={MarginStyle.marginT20}>
                    <Link href="/resetpassword" asChild>
                      <Pressable>
                        <ThemedText style={styles.textInteraction}>
                          ¿Has olvidado la contraseña?
                        </ThemedText>
                      </Pressable>
                    </Link>
                    <Link href="/newaccount" asChild>
                      <Pressable>
                        <ThemedText style={styles.textInteraction}>
                          ¿No tiene una cuenta? Cree una.
                        </ThemedText>
                      </Pressable>
                    </Link>
                  </View>
                </View>
                <View style={{ marginTop: 50, marginBottom: 20 }}>
                  <ThemedText
                    style={{ ...TextStyle.fontBoldCancel, ...TextStyle.center }}
                  >
                    {Platform.OS === PLATFORM_TYPE.IOS
                      ? VERSION_IOS
                      : VERSION_ANDROID}
                  </ThemedText>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  imgBg: {
    width: "100%",
    flex: 1,
  },
  logo: {
    height: 180,
    width: 180,
    marginTop: 70,
  },
  title: {
    paddingTop: 20,
    marginBottom: 60,
    textAlign: "center",
    fontSize: 35,
    fontWeight: "bold",
    color: ThemeColorsSthetic.primary,
  },
  label: {
    color: ThemeColorsSthetic.textTitle,
    textAlign: "center",
    marginBottom: 5,
  },
  centerInput: {
    justifyContent: "center",
    marginTop: 15,
  },
  icon: {
    position: "absolute",
    marginVertical: "auto",
    top: 5,
    right: 10,
  },
  textInteraction: {
    textAlign: "center",
    color: ThemeColorsSthetic.primary,
    marginBottom: 10,
  },
  withKeyboard: { height: Platform.OS === PLATFORM_TYPE.IOS ? "70%" : "60%" },
  withoutKeyboard: { flex: 1 },
});
