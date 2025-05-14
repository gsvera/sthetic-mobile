import { Redirect, Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getStoreSession, KEY_STORE } from "@/hooks/StoreDataSecure";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { useApiProvider } from "@/provider/InterceptorProvider";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { setToken, token } = useApiProvider();
  getStoreSession({ key: KEY_STORE.userToken }).then((value) => {
    if (value) setToken(value);
  });

  if (token === null) return <Redirect href="/login" />;

  return (
    <View
      style={{
        ...localStyle.container,
        paddingTop: insets.top,
        backgroundColor:
          colorScheme === "dark"
            ? ThemeColorsSthetic.backgroundStrong
            : ThemeColorsSthetic.backgroundLight,
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
