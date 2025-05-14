import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { STATUS_SERVICE } from "@/constants/Constants";
import { StatusScheduleType } from "@/constants/GeneralTypes";
import { GridStyle, TextStyle } from "@/constants/StyleComponents";
import { StyleSheet, View } from "react-native";

type tabsSatusScheduleProps = {
  statusSelected: StatusScheduleType;
  handleChangeStatus: (value: StatusScheduleType) => void;
};

export const TabsStatusSchedule = ({
  statusSelected,
  handleChangeStatus,
}: tabsSatusScheduleProps) => {
  return (
    <View style={localStyle.contentTabsBtn}>
      <GeneralButton
        textBtn="Todos"
        styleText={
          statusSelected === undefined
            ? TextStyle.fontBoldWhite
            : TextStyle.fontBoldBlue
        }
        styleBtn={
          statusSelected === undefined
            ? localStyle.btnStatusSelected
            : localStyle.btnStatus
        }
        handleOnPress={() => handleChangeStatus(undefined)}
      />
      <GeneralButton
        textBtn="Pendiente"
        styleText={
          statusSelected === STATUS_SERVICE.PENDIENT
            ? TextStyle.fontBoldWhite
            : TextStyle.fontBoldBlue
        }
        styleBtn={
          statusSelected === STATUS_SERVICE.PENDIENT
            ? localStyle.btnStatusSelected
            : localStyle.btnStatus
        }
        handleOnPress={() => handleChangeStatus(STATUS_SERVICE.PENDIENT)}
      />
      <GeneralButton
        textBtn="Confirmado"
        styleText={
          statusSelected === STATUS_SERVICE.ACCEPT
            ? TextStyle.fontBoldWhite
            : TextStyle.fontBoldBlue
        }
        styleBtn={
          statusSelected === STATUS_SERVICE.ACCEPT
            ? localStyle.btnStatusSelected
            : localStyle.btnStatus
        }
        handleOnPress={() => handleChangeStatus(STATUS_SERVICE.ACCEPT)}
      />
      <GeneralButton
        textBtn="Rechazado"
        styleText={
          statusSelected === STATUS_SERVICE.REJECT
            ? TextStyle.fontBoldWhite
            : TextStyle.fontBoldBlue
        }
        styleBtn={
          statusSelected === STATUS_SERVICE.REJECT
            ? localStyle.btnStatusSelected
            : localStyle.btnStatus
        }
        handleOnPress={() => handleChangeStatus(STATUS_SERVICE.REJECT)}
      />
    </View>
  );
};

const localStyle = StyleSheet.create({
  contentTabsBtn: {
    ...GridStyle.rowSpaceBetween,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  btnStatus: {
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: ThemeColorsSthetic.textTitle,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  btnStatusSelected: {
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: ThemeColorsSthetic.textTitle,
    backgroundColor: ThemeColorsSthetic.textTitle,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
});
export default TabsStatusSchedule;
