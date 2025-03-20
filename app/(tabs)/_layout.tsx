import { Redirect, Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  getStoreSession,
  KEY_STORE,
  setStoreSession,
} from "@/hooks/StoreDataSecure";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { useApiProvider } from "@/provider/InterceptorProvider";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { setToken } = useApiProvider();
  const [tokenSession, setTokenSession] = useState<string | null>("");

  getStoreSession({ key: KEY_STORE.userToken }).then((value) => {
    setTokenSession(value);
    setToken(value);
  });

  // setStoreSession({ key: KEY_STORE.userToken, value: "" });

  if (tokenSession === null) return <Redirect href="/login" />;

  return (
    <SafeAreaView style={localStyle.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color }) => (
              // <Entypo name="home" size={28} color={color} />
              <MaterialIcons name="schedule-send" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: "Calendario",
            tabBarIcon: ({ color }) => (
              <AntDesign name="calendar" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: "Más",
            tabBarIcon: ({ color }) => (
              // <AntDesign name="setting" size={28} color={color} />
              <FontAwesome6 name="bars" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const localStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
});
