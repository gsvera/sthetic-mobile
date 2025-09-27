import { AdminCalendarProvider } from "@/components/Modules/AdminCalendarProvider";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { getStoreSession, KEY_STORE } from "@/hooks/StoreDataSecure";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Calendar() {
  const [idUser, setIdUser] = useState("");

  getStoreSession({ key: KEY_STORE.idUser }).then(
    (value) => value && setIdUser(value)
  );

  if (!idUser) return <></>;

  return (
    <View>
      <View style={localStyle.header}>
        <Image
          source={require("@/assets/images/me-logo-header.png")}
          style={localStyle.logo}
        />
      </View>
      <AdminCalendarProvider idUser={idUser} />
    </View>
  );
}

const localStyle = StyleSheet.create({
  header: {
    height: 70,
    paddingVertical: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: ThemeColorsSthetic.backgroundStrong,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
});
