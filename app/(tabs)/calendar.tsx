import { AdminCalendarProvider } from "@/components/Modules/AdminCalendarProvider";
import { getStoreSession, KEY_STORE } from "@/hooks/StoreDataSecure";
import { useState } from "react";
import { View } from "react-native";

export default function Calendar() {
  const [idUser, setIdUser] = useState("");

  getStoreSession({ key: KEY_STORE.idUser }).then(
    (value) => value && setIdUser(value)
  );
  if (!idUser) return <></>;

  return (
    <View>
      <AdminCalendarProvider idUser={idUser} />
    </View>
  );
}
