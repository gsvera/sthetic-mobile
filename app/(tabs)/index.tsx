import Schedules from "@/components/Modules/Schedules";
import { ThemedText } from "@/components/ThemedText";

import { Container, ThemeColorsSthetic } from "@/constants/Colors";
import { FORMAT_DATE, PLATFORM_TYPE } from "@/constants/Constants";
import { GridStyle, TextStyle } from "@/constants/StyleComponents";
import { getStoreSession, KEY_STORE } from "@/hooks/StoreDataSecure";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";
import { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusScheduleType } from "@/constants/GeneralTypes";
import TabsStatusSchedule from "@/components/Modules/Schedules/TabsStatusSchedule";

export default function Home() {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [idUser, setIdUser] = useState("");
  const [dateSearch, setDateSearch] = useState(
    dayjs().format(FORMAT_DATE.GENERAL_EN)
  );
  const [statusSelected, setStatusSelected] = useState<StatusScheduleType>();

  getStoreSession({ key: KEY_STORE.idUser }).then(
    (value) => value && setIdUser(value)
  );

  if (!idUser) return <></>;

  const handleChageDate = (date: Date) => {
    setDateSearch(dayjs(date).format(FORMAT_DATE.GENERAL_EN));
    setOpenDatePicker(false);
  };

  const onChangeStatus = (valueStatus: StatusScheduleType) => {
    setStatusSelected(valueStatus);
  };

  return (
    <View style={Container.container}>
      <View style={localStyle.header}>
        <Image
          source={require("@/assets/images/me-text-worker-logo.png")}
          style={localStyle.logo}
        />
      </View>
      <View style={localStyle.headerTitle}>
        <ThemedText style={TextStyle.titleModal}>Mis citas del día:</ThemedText>
        <TouchableOpacity
          style={localStyle.contentDate}
          onPress={() => setOpenDatePicker(true)}
        >
          <ThemedText style={localStyle.labelDate}>{dateSearch}</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={localStyle.contentTabs}>
        <TabsStatusSchedule
          statusSelected={statusSelected}
          handleChangeStatus={onChangeStatus}
        />
      </View>
      <View
        style={{ height: Platform.OS === PLATFORM_TYPE.IOS ? "66%" : "71%" }}
      >
        <Schedules
          idUser={idUser}
          day={dateSearch}
          statusSchedule={statusSelected}
        />
      </View>
      <DateTimePickerModal
        isVisible={openDatePicker}
        mode="date"
        onConfirm={handleChageDate}
        onCancel={() => setOpenDatePicker(false)}
      />
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
  labelDate: {
    ...TextStyle.label,
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 28,
  },
  headerTitle: {
    ...GridStyle.rowSpaceBetween,
    ...GridStyle.rowItemsVerticalCenter,
    width: "90%",
    marginHorizontal: "auto",
    marginBottom: Platform.OS === PLATFORM_TYPE.IOS ? 10 : 5,
  },
  contentDate: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 5,
  },
  contentTabs: {
    marginBottom: Platform.OS === PLATFORM_TYPE.IOS ? 10 : 5,
  },
});
