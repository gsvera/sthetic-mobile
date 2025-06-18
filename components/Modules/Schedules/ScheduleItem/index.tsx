import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { STATUS_SERVICE } from "@/constants/Constants";
import { ScheduleType } from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { convertHourToAMorPM, openLink } from "@/utils/GeneralUtils";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { scheduleSelectType } from "..";
import { useMemo } from "react";
import dayjs from "dayjs";

type scheduleItemProps = {
  item: ScheduleType;
  handleAcceptService: (data: scheduleSelectType) => void;
  handleRejectSchedule: (data: scheduleSelectType) => void;
};

export const ScheduleItem = ({
  item,
  handleAcceptService,
  handleRejectSchedule,
}: scheduleItemProps) => {
  const acceptService = (status: STATUS_SERVICE) =>
    handleAcceptService({ id: item.id, statusSchedule: status });
  const rejectService = (status: STATUS_SERVICE) =>
    handleRejectSchedule({ id: item.id, statusSchedule: status });

  const isOverTime = useMemo(() => {
    const [hour, minute] = item.endTime.split(":");
    const limitTime = dayjs()
      .set("hour", parseInt(hour))
      .set("minute", parseInt(minute));
    return dayjs().isAfter(limitTime);
  }, [item.endTime]);

  const textStatus = (statusSchedule: number) => {
    switch (statusSchedule) {
      case STATUS_SERVICE.PENDIENT:
        return (
          <ThemedText
            style={{ ...TextStyle.fontBoldDark, ...localStyle.textStatus }}
          >
            Pendiente por confirmar
          </ThemedText>
        );
      case STATUS_SERVICE.CANCEL:
        return (
          <ThemedText
            style={{ ...TextStyle.fontBoldCancel, ...localStyle.textStatus }}
          >
            Cancelado
          </ThemedText>
        );
      case STATUS_SERVICE.REJECT:
        return (
          <ThemedText
            style={{ ...TextStyle.fontBoldError, ...localStyle.textStatus }}
          >
            Rechazado
          </ThemedText>
        );
      case STATUS_SERVICE.ACCEPT:
        return (
          <ThemedText
            style={{ ...TextStyle.fontBoldAccept, ...localStyle.textStatus }}
          >
            Confirmado
          </ThemedText>
        );
      case STATUS_SERVICE.NOPRESENT:
        return (
          <ThemedText
            style={{ ...TextStyle.fontBoldCancel, ...localStyle.textStatus }}
          >
            No se presento
          </ThemedText>
        );
      case STATUS_SERVICE.FINALIZED:
        return (
          <ThemedText
            style={{ ...TextStyle.fontBoldFinalized, ...localStyle.textStatus }}
          >
            Finalizado
          </ThemedText>
        );
    }
  };

  return (
    <View style={localStyle.scheduleItem}>
      <View style={GridStyle.rowContentCenter}>
        {textStatus(item.statusService)}
      </View>
      {item?.comments && (
        <ThemedText style={{ ...TextStyle.textNote, ...TextStyle.center }}>
          {item.comments}
        </ThemedText>
      )}
      <View style={{ ...localStyle.rowInfo, marginTop: 15 }}>
        <View>
          <ThemedText style={TextStyle.label}>Horario de servicio:</ThemedText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <ThemedText style={TextStyle.value}>
            de {convertHourToAMorPM(item?.startTime)}{" "}
          </ThemedText>

          <ThemedText style={TextStyle.value}>
            a {convertHourToAMorPM(item?.endTime)}
          </ThemedText>
        </View>
      </View>
      <View style={localStyle.rowInfo}>
        <ThemedText style={TextStyle.label}>Servicio: </ThemedText>
        <ThemedText style={TextStyle.title}>{item.nameService}</ThemedText>
      </View>
      <View style={localStyle.rowInfo}>
        <ThemedText style={TextStyle.label}>Cliente:</ThemedText>
        <ThemedText style={TextStyle.value}>
          {item.idClient.firstName} {item.idClient.lastName}
        </ThemedText>
      </View>
      <View style={localStyle.rowInfo}>
        <ThemedText style={TextStyle.label}>Contactar: </ThemedText>
        <View style={GridStyle.rowSpaceBetween}>
          <TouchableOpacity
            onPress={() => openLink(`tel:${item.idClient.phone}`)}
          >
            <Feather name="phone-outgoing" style={localStyle.iconSocialMedia} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              openLink(
                `https://wa.me/${item.idClient.lada.substring(0, 1)}${
                  item.idClient.phone
                }`
              )
            }
          >
            <MaterialCommunityIcons
              name="whatsapp"
              style={localStyle.iconSocialMedia}
            />
          </TouchableOpacity>
        </View>
      </View>
      {item.statusService === STATUS_SERVICE.PENDIENT && (
        <View style={localStyle.rowInfo}>
          <GeneralButton
            textBtn="Aceptar"
            styleText={TextStyle.fontBoldWhite}
            styleBtn={{
              ...ButtonGeneralStyle.btnSaveSthetic,
              ...localStyle.btn,
            }}
            handleOnPress={() => acceptService(STATUS_SERVICE.ACCEPT)}
          />
          <GeneralButton
            textBtn="Rechazar"
            styleText={TextStyle.fontBoldWhite}
            styleBtn={{
              ...ButtonGeneralStyle.btnCancelSthetic,
              ...localStyle.btn,
            }}
            handleOnPress={() => rejectService(STATUS_SERVICE.REJECT)}
          />
        </View>
      )}
      {item.statusService === STATUS_SERVICE.ACCEPT && (
        <View style={localStyle.rowInfo}>
          <GeneralButton
            textBtn="Finalizar"
            styleText={TextStyle.fontBoldWhite}
            styleBtn={{
              ...ButtonGeneralStyle.btnSaveSthetic,
              ...localStyle.btn,
            }}
            handleOnPress={() => acceptService(STATUS_SERVICE.FINALIZED)}
          />
          <GeneralButton
            textBtn={isOverTime ? "No se presento" : "Cancelar"}
            styleText={TextStyle.fontBoldWhite}
            styleBtn={{
              ...ButtonGeneralStyle.btnCancelSthetic,
              ...localStyle.btn,
            }}
            handleOnPress={() =>
              rejectService(
                isOverTime ? STATUS_SERVICE.NOPRESENT : STATUS_SERVICE.CANCEL
              )
            }
          />
        </View>
      )}
    </View>
  );
};

const localStyle = StyleSheet.create({
  scheduleItem: {
    borderWidth: 0.3,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 10,
  },
  rowInfo: {
    ...GridStyle.rowSpaceBetween,
    marginBottom: 10,
  },
  iconSocialMedia: {
    fontSize: 22,
    color: ThemeColorsSthetic.accentReverse,
    marginLeft: 13,
  },
  btn: {
    width: "49%",
  },
  textStatus: {
    fontSize: 20,
    marginTop: 10,
  },
});
export default ScheduleItem;
