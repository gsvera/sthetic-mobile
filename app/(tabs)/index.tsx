import Schedules from "@/components/Modules/Schedules";
import { ThemedText } from "@/components/ThemedText";

import { Container, ThemeColorsSthetic } from "@/constants/Colors";
import { FORMAT_DATE } from "@/constants/Constants";
import { TextStyle } from "@/constants/StyleComponents";
import { getStoreSession, KEY_STORE } from "@/hooks/StoreDataSecure";
import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

export default function Home() {
  const [idUser, setIdUser] = useState("");

  getStoreSession({ key: KEY_STORE.idUser }).then(
    (value) => value && setIdUser(value)
  );

  if (!idUser) return <></>;

  return (
    <View style={Container.container}>
      <View style={localStyle.header}>
        <Image
          source={require("@/assets/images/me-text-worker-logo.png")}
          style={localStyle.logo}
        />
        <Pressable
          style={localStyle.inputSearch}
          // onPress={() => setOpenSearchModal((v) => !v)}
        >
          <ThemedText style={{ color: ThemeColorsSthetic.text }}>
            Buscar
          </ThemedText>
          <Feather
            name="search"
            size={20}
            color={ThemeColorsSthetic.accentReverse}
          />
        </Pressable>
      </View>
      <View>
        <ThemedText style={localStyle.dateString}>
          {dayjs().format(FORMAT_DATE.GENERAL_EN)}
        </ThemedText>
      </View>
      <Schedules idUser={idUser} day={dayjs().format(FORMAT_DATE.GENERAL_EN)} />
    </View>
  );
}

const localStyle = StyleSheet.create({
  header: {
    paddingVertical: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: ThemeColorsSthetic.backgroundStrong,
  },
  inputSearch: {
    ...TextStyle.value,
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColorsSthetic.muted,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 30,
    width: 100,
  },
  logo: {
    width: 150,
    height: 50,
  },
  dateString: {
    ...TextStyle.label,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 15,
  },
});
