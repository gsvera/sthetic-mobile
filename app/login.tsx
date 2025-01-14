import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import {
  Container,
  GlobalColors,
  loginStyle,
  textColors,
} from "@/constants/Colors";
import { Link, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { apiUser } from "@/api/User";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { KEY_STORE, setStoreSession } from "@/hooks/StoreDataSecure";
import { useApiProvider } from "@/provider/InterceptorProvider";
import ContentKeyboardAutoScroll from "@/components/Shared/ContentKeyboardAutoScroll";

const schema = yup.object({
  username: yup.string().required("Ingrese un usuario valid"),
  password: yup.string().required("Ingrese su contraseña"),
});

export default function Login() {
  const navigation = useNavigation();
  const { setToken } = useApiProvider();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate: login } = useMutation({
    mutationFn: (data) => apiUser.login(data),
    onSuccess: (data: ResponseAPi) => handleSuccessLogin(data),
    onError: (error: any) => handleError(error),
  });

  const handleSuccessLogin = (data: ResponseAPi) => {
    if (data.data.error) {
      ErrorAlertMessage("Usuario o contraseña invalido");
      return;
    }
    setStoreSession({
      key: KEY_STORE.userToken,
      value: data.data.items?.token,
    });
    setToken(data.data.items?.token);
    navigation.navigate("(tabs)" as never);
  };

  const handleError = (error: any) => {
    ErrorAlertMessage(
      "Hubo un problema al querer inciar sesión, por favor intentelo mas tarde"
    );
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const imageBg = require("@/assets/images/background.webp");

  const onSubmit = (data: any) => {
    setToken(null);
    login(data);
  };

  return (
    <SafeAreaView style={Container.containerLogin}>
      <ImageBackground source={imageBg} style={styles.imgBg}>
        <ContentKeyboardAutoScroll>
          <View style={styles.imgContainer}>
            <Image
              source={require("@/assets/images/react-logo.png")}
              style={styles.logo}
            />
          </View>
          <ThemedText style={styles.title}>Inicia sesión</ThemedText>
          <View style={loginStyle.centerInput}>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={loginStyle.input}
                  placeholder="Ingrese su usuario"
                  keyboardType="email-address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.username && (
              <Text style={textColors.errors}>{errors.username.message}</Text>
            )}
          </View>
          <View style={loginStyle.centerInput}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={loginStyle.input}
                  placeholder="Ingrese su password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={true}
                />
              )}
            />
          </View>
          <View
            style={{ ...loginStyle.centerInput, ...loginStyle.buttonSubmit }}
          >
            <Button title="Iniciar sesion" onPress={handleSubmit(onSubmit)} />
            <ThemedText style={loginStyle.textInteraction} onPress={() => {}}>
              ¿Has olvidado la contraseña?
            </ThemedText>
            <Link href="/newaccount" asChild>
              <Pressable>
                <ThemedText style={loginStyle.textInteraction}>
                  ¿No tiene una cuenta? Cree una.
                </ThemedText>
              </Pressable>
            </Link>
          </View>
        </ContentKeyboardAutoScroll>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  imgBg: {
    width: "100%",
    height: "100%",
  },
  logo: {
    height: 100,
    width: 100,
    marginTop: 100,
  },
  title: {
    paddingTop: 20,
    marginBottom: 60,
    textAlign: "center",
    fontSize: 30,
    color: GlobalColors.pinkColor,
  },
});
