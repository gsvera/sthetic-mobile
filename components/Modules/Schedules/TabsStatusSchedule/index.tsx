import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { STATUS_SERVICE } from "@/constants/Constants";
import { StatusScheduleType } from "@/constants/GeneralTypes";
import { TextStyle } from "@/constants/StyleComponents";
import { ScrollView, StyleSheet } from "react-native";

type tabsSatusScheduleProps = {
  statusSelected: StatusScheduleType;
  handleChangeStatus: (value: StatusScheduleType) => void;
};

export const TabsStatusSchedule = ({
  statusSelected,
  handleChangeStatus,
}: tabsSatusScheduleProps) => {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={localStyle.contentTabsBtn}
    >
      <GeneralButton
        textBtn="Todos"
        styleText={
          statusSelected === undefined
            ? localStyle.tabSelected
            : localStyle.tabUnSelected
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
            ? localStyle.tabSelected
            : localStyle.tabUnSelected
        }
        styleBtn={
          statusSelected === STATUS_SERVICE.PENDIENT
            ? localStyle.btnStatusSelected
            : localStyle.btnStatus
        }
        handleOnPress={() => handleChangeStatus(STATUS_SERVICE.PENDIENT)}
      />
      <GeneralButton
        textBtn="Rechazado"
        styleText={
          statusSelected === STATUS_SERVICE.REJECT
            ? localStyle.tabSelected
            : localStyle.tabUnSelected
        }
        styleBtn={
          statusSelected === STATUS_SERVICE.REJECT
            ? localStyle.btnStatusSelected
            : localStyle.btnStatus
        }
        handleOnPress={() => handleChangeStatus(STATUS_SERVICE.REJECT)}
      />
      <GeneralButton
        textBtn="Confirmado"
        styleText={
          statusSelected === STATUS_SERVICE.ACCEPT
            ? localStyle.tabSelected
            : localStyle.tabUnSelected
        }
        styleBtn={
          statusSelected === STATUS_SERVICE.ACCEPT
            ? localStyle.btnStatusSelected
            : localStyle.btnStatus
        }
        handleOnPress={() => handleChangeStatus(STATUS_SERVICE.ACCEPT)}
      />
      <GeneralButton
        textBtn="Cancelado"
        styleText={
          statusSelected === STATUS_SERVICE.CANCEL
            ? localStyle.tabSelected
            : localStyle.tabUnSelected
        }
        styleBtn={
          statusSelected === STATUS_SERVICE.CANCEL
            ? localStyle.btnStatusSelected
            : localStyle.btnStatus
        }
        handleOnPress={() => handleChangeStatus(STATUS_SERVICE.CANCEL)}
      />
      <GeneralButton
        textBtn="No se presento"
        styleText={
          statusSelected === STATUS_SERVICE.NOPRESENT
            ? localStyle.tabSelected
            : localStyle.tabUnSelected
        }
        styleBtn={
          statusSelected === STATUS_SERVICE.NOPRESENT
            ? localStyle.btnStatusSelected
            : localStyle.btnStatus
        }
        handleOnPress={() => handleChangeStatus(STATUS_SERVICE.NOPRESENT)}
      />
      <GeneralButton
        textBtn="Finalizado"
        styleText={
          statusSelected === STATUS_SERVICE.FINALIZED
            ? localStyle.tabSelected
            : localStyle.tabUnSelected
        }
        styleBtn={
          statusSelected === STATUS_SERVICE.FINALIZED
            ? localStyle.btnStatusSelected
            : localStyle.btnStatus
        }
        handleOnPress={() => handleChangeStatus(STATUS_SERVICE.FINALIZED)}
      />
    </ScrollView>
  );
};

const localStyle = StyleSheet.create({
  contentTabsBtn: {
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  btnStatus: {
    marginRight: 8,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: ThemeColorsSthetic.textTitle,
    paddingVertical: 5,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  btnStatusSelected: {
    marginRight: 8,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: ThemeColorsSthetic.textTitle,
    backgroundColor: ThemeColorsSthetic.textTitle,
    paddingVertical: 5,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tabSelected: {
    ...TextStyle.fontBoldWhite,
    fontSize: 14,
  },
  tabUnSelected: {
    ...TextStyle.fontBoldBlue,
    fontSize: 14,
  },
});
export default TabsStatusSchedule;
