import {
  DEFAULT_VALUES_WEEK,
  PLATFORM_TYPE,
  TYPE_STATUS,
} from "@/constants/Constants";
import { modalCustomProps } from "@/constants/GeneralTypes";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Modal,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { weekDaysProps } from "../types";
import { ThemedText } from "@/components/ThemedText";
import { ButtonGeneralStyle, TextStyle } from "@/constants/StyleComponents";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCalendar } from "@/api/Calendar";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import AvailableTimeCard from "../AvailableTimeCard";
import { ThemeColorsSthetic } from "@/constants/Colors";
import GeneralButton from "@/components/Shared/GeneralButton";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";

type availableWeekProps = modalCustomProps & {
  daysByweek: weekDaysProps[];
};

export const AvailibleWeek = ({
  open,
  handleCloseModal,
  idUser,
  daysByweek,
}: availableWeekProps) => {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { handleNotification } = useNotificationProvider();
  const { height } = Dimensions.get("window");
  const [availableTimeWeek, setAvailableTimeWeek] = useState<weekDaysProps[]>(
    []
  );

  /**
   * Sirve para evitar la mutacion por referencia.
   * @returns array
   */
  const cloneWeekDefaults = () =>
    DEFAULT_VALUES_WEEK.map((item) => ({ ...item }));

  useEffect(() => {
    if (daysByweek.length > 0) {
      handleSetDaysSaved();
    }
  }, [open]);

  useEffect(() => {
    if (open) handleSetDaysSaved();
  }, [open]);

  const handleSetDaysSaved = () => {
    const newArrWeek = [];
    for (let i = 0; i < cloneWeekDefaults().length; i++) {
      const daySaved = daysByweek.find(
        (item: weekDaysProps) => item.day === cloneWeekDefaults()[i].day
      );
      if (daySaved) {
        daySaved.isActive = true;
        newArrWeek.push(daySaved);
      } else newArrWeek.push(cloneWeekDefaults()[i]);
    }
    setAvailableTimeWeek(newArrWeek);
  };

  const { mutate: saveCalendar } = useMutation({
    mutationFn: (data: any) => apiCalendar.saveCalendar(data),
    onSuccess: (data: ResponseApi) => handleSuccessSaveCalendar(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessSaveCalendar = (data: ObjectResponse) => {
    if (data.error)
      return handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });
    queryClient.invalidateQueries({
      queryKey: [REACT_QUERY_KEYS.calendar.calendarByUser.getByIdUser(idUser)],
    });
    handleNotification({
      type: TYPE_STATUS.SUCCESS,
      message: "Calendario guardado con éxito",
    });
    handleCloseModal();
  };

  const handleSaveCalendar = () => {
    const validDays = availableTimeWeek.filter((item) => item.isActive);
    if (validDays.length > 0) {
      const validFields = validDays.filter(
        (item) =>
          item.duration === 0 ||
          item.maxReservations === 0 ||
          item.startTime === "" ||
          item.endTime === ""
      );
      if (validFields.length > 0)
        return ErrorAlertMessage({
          message: "Debe llenar los campos obligatorios",
        });
      saveCalendar(
        availableTimeWeek
          .map((item) => ({ ...item, idUser }))
          .filter((item) => item.isActive)
      );
    } else
      ErrorAlertMessage({
        message: "Debe configurar al menos un día a la semana",
      });
  };

  const handleUpdateArrDay = (day: weekDaysProps) => {
    const newArrUpdated = availableTimeWeek.map((item) => {
      if (item.day === day.day) return day;
      else return item;
    });
    setAvailableTimeWeek(newArrUpdated);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={handleCloseModal}
      style={{ flex: 1 }}
    >
      <View
        style={{
          ...localStyle.contentBody,
          backgroundColor: ThemeColorsSthetic.backgroundLight,
          flex: 1,
          top: insets.top,
          bottom: insets.bottom,
        }}
      >
        <ButtonCloseModal handleOnPress={handleCloseModal} />
        <View style={{ marginBottom: 10 }}>
          <ThemedText type="subtitle" style={TextStyle.titleModal}>
            Disponibilidad semanal
          </ThemedText>
        </View>
        <View
          style={{
            height: height * (Platform.OS === PLATFORM_TYPE.IOS ? 0.75 : 0.68),
          }}
        >
          <ScrollView style={{ flexGrow: 1 }}>
            {availableTimeWeek.map((day, i) => (
              <AvailableTimeCard
                key={i}
                day={day}
                updateDataDay={handleUpdateArrDay}
              />
            ))}
          </ScrollView>
        </View>
        <View style={localStyle.contentBtnSave}>
          <GeneralButton
            styleBtn={localStyle.btnSave}
            textBtn="Actualizar datos"
            styleText={TextStyle.fontBoldWhite}
            handleOnPress={handleSaveCalendar}
          />
        </View>
      </View>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  contentBtnClose: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 15,
  },
  contentBody: {
    paddingHorizontal: 16,
  },
  contentBtnSave: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  btnSave: {
    ...ButtonGeneralStyle.btnUpdateSthetic,
    width: "70%",
  },
  cardRowItem: {
    width: "45%",
  },
});

export default AvailibleWeek;
