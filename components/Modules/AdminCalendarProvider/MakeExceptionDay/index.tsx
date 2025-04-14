import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { exceptionDayType, weekDaysProps } from "../types";
import AvailableTimeCard from "../AvailableTimeCard";
import { SimpleLineIcons } from "@expo/vector-icons";
import { modalCustomProps } from "@/constants/GeneralTypes";
import { ThemedText } from "@/components/ThemedText";
import {
  ButtonGeneralStyle,
  InputStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { useEffect, useState } from "react";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCalendar } from "@/api/Calendar";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { FORMAT_DATE, TYPE_STATUS } from "@/constants/Constants";
import { convertDateToGeneralFormat } from "@/utils/GeneralUtils";
import ContentKeyboardAutoScroll from "@/components/Shared/ContentKeyboardAutoScroll";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ThemeColorsSthetic } from "@/constants/Colors";
import GeneralButton from "@/components/Shared/GeneralButton";

type exceptionDayProps = modalCustomProps & {
  day: weekDaysProps;
  entityToEdit?: exceptionDayType;
};

export const MakeExceptionDay = ({
  open,
  handleCloseModal,
  idUser,
  day,
  entityToEdit,
}: exceptionDayProps) => {
  const { handleNotification } = useNotificationProvider();
  const queryClient = useQueryClient();
  const [commentsException, setCommentsException] = useState("");
  const [localDay, setLocalDay] = useState<weekDaysProps>();

  const { mutate: saveExceptionDay } = useMutation({
    mutationFn: (data: any) => apiCalendar.saveExceptionDay(data),
    onSuccess: (data: ResponseAPi) => handleSuccessSaveExceptionDay(data.data),
    onError: ErrorAlertMessage,
  });

  const { mutate: updateExceptionDay } = useMutation({
    mutationFn: (data: any) => apiCalendar.updateExceptionDay(data),
    onSuccess: (data: ResponseAPi) => handleSuccessSaveExceptionDay(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessSaveExceptionDay = (data: ObjectResponse) => {
    if (data.error) return ErrorAlertMessage({ message: data.message });
    handleNotification({
      type: TYPE_STATUS.SUCCESS,
      message: `Cambio de horario de la fecha ${day.dateString} guardado con éxito`,
    });
    queryClient.invalidateQueries({
      queryKey: [
        REACT_QUERY_KEYS.calendar.calendarException.getByUser(idUser as string),
      ],
    });
    handleCloseModalException();
  };

  useEffect(() => {
    handleMakeExceptionDay(day);
    if (entityToEdit && open) {
      handleMakeExceptionDay(entityToEdit);
      setCommentsException(entityToEdit.comments);
    }
  }, [open]);

  const handleMakeExceptionDay = (day: weekDaysProps) => {
    setLocalDay((value) => ({ ...value, ...day }));
  };

  const handleCloseModalException = () => {
    handleMakeExceptionDay(day);
    setCommentsException("");
    handleCloseModal();
  };

  const handleSaveException = () => {
    if (localDay?.isActive) {
      if (
        localDay.duration === 0 ||
        localDay.maxReservations === 0 ||
        localDay.startTime === "" ||
        localDay.endTime === ""
      ) {
        return ErrorAlertMessage({
          message: "Debe llenar los campos obligatorios",
        });
      }
    }

    const dateFormat = convertDateToGeneralFormat(
      localDay?.dateString,
      FORMAT_DATE.TIME_STAMP
    );

    if (entityToEdit) {
      updateExceptionDay({
        ...entityToEdit,
        ...localDay,
        id: entityToEdit.id,
        dateString: dateFormat,
        comments: commentsException,
      });
    } else
      saveExceptionDay({
        ...localDay,
        idUser,
        dateString: dateFormat,
        comments: commentsException,
      });
  };

  if (!localDay) return <></>;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={open}
      style={{ padding: 16 }}
    >
      <ContentKeyboardAutoScroll>
        <View style={localStyle.contentBody}>
          <View style={localStyle.contentBtnClose}>
            <Pressable onPress={handleCloseModalException}>
              <SimpleLineIcons
                name="close"
                size={24}
                color={ThemeColorsSthetic.accentReverse}
              />
            </Pressable>
          </View>
          <View style={{ marginBottom: 10 }}>
            <ThemedText style={TextStyle.titleModal}>
              Cambio de horario para el día {day.dateString}
            </ThemedText>
          </View>
          <AvailableTimeCard
            day={localDay}
            updateDataDay={handleMakeExceptionDay}
          />
          <View>
            <ThemedText style={localStyle.label}>
              Agrega un comentario por el cambio de horario
            </ThemedText>
            <TextInput
              style={localStyle.inputComments}
              onChangeText={setCommentsException}
              value={commentsException}
              multiline
              numberOfLines={6}
            />
            <View style={localStyle.contentSaveBtn}>
              <GeneralButton
                styleBtn={ButtonGeneralStyle.btnUpdateSthetic}
                textBtn="Guardar exception"
                styleText={TextStyle.fontBoldWhite}
                handleOnPress={handleSaveException}
              />
            </View>
          </View>
        </View>
      </ContentKeyboardAutoScroll>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  contentBody: {
    paddingHorizontal: 15,
  },
  contentBtnClose: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 15,
  },
  title: {
    ...TextStyle.fontBoldDark,
    ...TextStyle.center,
  },
  label: {
    ...TextStyle.label,
    ...TextStyle.center,
  },
  inputComments: {
    ...InputStyle.withBorder,
    ...InputStyle.bigBox,
    ...TextStyle.value,
    marginTop: 10,
  },
  contentSaveBtn: {
    width: "70%",
    marginTop: 15,
    marginHorizontal: "auto",
  },
});

export default MakeExceptionDay;
