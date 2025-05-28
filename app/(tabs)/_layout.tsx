import { Tabs, useNavigation } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getStoreSession, KEY_STORE } from "@/hooks/StoreDataSecure";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { useApiProvider } from "@/provider/InterceptorProvider";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "@/provider/ws/socketService";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useMutation } from "@tanstack/react-query";
import apiUserConfig from "@/api/UserConfig";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { TYPE_STATUS } from "@/constants/Constants";
import { useSessionProvider } from "@/provider/SessionProvider";

export default function TabLayout() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { handleNotification } = useNotificationProvider();
  const { setToken, token } = useApiProvider();
  const { storeSessionProvider } = useSessionProvider();
  console.log("🚀 ~ TabLayout ~ storeSessionProvider:", storeSessionProvider);
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  const { mutate: saveTokenNotification } = useMutation({
    mutationFn: (data: any) => apiUserConfig.saveTokenNotification(data),
    onSuccess: (data: ResponseApi) =>
      handleSuccessSaveTokenNotification(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessSaveTokenNotification = (data: ObjectResponse) => {
    if (data.error)
      return handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });
    handleNotification({ type: TYPE_STATUS.SUCCESS, message: data.message });
  };

  useEffect(() => {
    getStoreSession({ key: KEY_STORE.userToken }).then((value) => {
      if (!value) return navigation.navigate("login" as never);
      else setToken(value);
    });
  }, [token]);

  // useEffect(() => {
  //   if (token) {
  //     connectWebSocket(token, handleNotificationWs);
  //     return () => {
  //       disconnectWebSocket();
  //     };
  //   }
  // }, [token]);

  useEffect(() => {
    if (token && storeSessionProvider?.idUser) {
      registerForPushNotificationsAsync().then((tokenNotification) => {
        console.log(
          "🚀 ~ registerForPushNotificationsAsync ~ tokenNotification:",
          tokenNotification
        );
        if (tokenNotification) {
          console.log("Push tokenNotifications:", tokenNotification);
          saveTokenNotification({
            id: storeSessionProvider?.idUser,
            tokenNotification,
          });
        }
      });

      // Escucha cuando llega una notificación y la app está en primer plano
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("Notificación recibida:", notification);
        });

      // Escucha cuando el usuario toca la notificación
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("Respuesta a notificación:", response);
        });

      return () => {
        notificationListener.current && notificationListener.current?.remove();
        responseListener.current && responseListener.current?.remove();
      };
    }
  }, [token, storeSessionProvider]);

  const handleNotificationWs = (data: any) => {
    console.log("🔔 Notificación:", data);
    // Aquí puedes lanzar un modal, toast, actualizar UI, etc.
  };

  if (!token) return <></>;

  return (
    <View
      style={{
        ...localStyle.container,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor:
          colorScheme === "dark"
            ? ThemeColorsSthetic.backgroundStrong
            : ThemeColorsSthetic.backgroundStrong,
      }}
    >
      <View style={localStyle.container}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: ThemeColorsSthetic.accent,
            tabBarActiveBackgroundColor: ThemeColorsSthetic.backgroundLight,
            tabBarInactiveBackgroundColor: "white",
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
              ...Platform.select({
                ios: {
                  // Use a transparent background on iOS to show the blur effect
                  position: "absolute",
                },
                default: {},
              }),
              height: 50,
              paddingBottom: 0,
              borderTopWidth: 0,
              backgroundColor: ThemeColorsSthetic.backgroundLight,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Inicio",
              tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
              tabBarIcon: ({ color, focused }) => (
                <MaterialIcons
                  name="schedule-send"
                  size={28}
                  color={
                    focused
                      ? ThemeColorsSthetic.accent
                      : ThemeColorsSthetic.muted
                  }
                />
              ),
            }}
          />
          <Tabs.Screen
            name="calendar"
            options={{
              title: "Calendario",
              tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
              tabBarIcon: ({ color, focused }) => (
                <AntDesign
                  name="calendar"
                  size={28}
                  color={
                    focused
                      ? ThemeColorsSthetic.accent
                      : ThemeColorsSthetic.muted
                  }
                />
              ),
            }}
          />
          <Tabs.Screen
            name="more"
            options={{
              title: "Más",
              tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
              tabBarIcon: ({ color, focused }) => (
                <FontAwesome6
                  name="bars"
                  size={28}
                  color={
                    focused
                      ? ThemeColorsSthetic.accent
                      : ThemeColorsSthetic.muted
                  }
                />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

const localStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
});

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert("Debes usar un dispositivo físico para recibir notificaciones push");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("No se otorgaron permisos para notificaciones push");
    return;
  }
  const tokenData = await Notifications.getExpoPushTokenAsync();
  console.log("🚀 ~ registerForPushNotificationsAsync ~ tokenData:", tokenData);
  return tokenData.data;
}
