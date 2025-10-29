import { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { exceptionDayType, weekDaysProps } from "./types";
import { ThemedText } from "@/components/ThemedText";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import AvailibleWeek from "./AvalibleWeek";
import dayjs from "dayjs";
import {
  DEFAULT_VALUES_WEEK,
  FORMAT_DATE,
  PLATFORM_TYPE,
  TYPE_STATUS,
} from "@/constants/Constants";
import { MakeExceptionDay } from "./MakeExceptionDay";
import { useMutation, useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { apiCalendar } from "@/api/Calendar";
import { getStoreSession, KEY_STORE } from "@/hooks/StoreDataSecure";
import "dayjs/locale/es";
import { convertDateToGeneralFormat } from "@/utils/GeneralUtils";
import ExceptionDay from "./ExceptionDay";
import GeneralButton from "@/components/Shared/GeneralButton";
import { Feather } from "@expo/vector-icons";
import ModalConfirm from "@/components/Shared/ModalConfirm";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import LoadingView from "@/components/Shared/LoadingView";
import { MakeScheduleDate } from "./MakeScheduleDate";

dayjs.locale("es"); // Esta config se debera establecer a futuro para ingles tambien

type adminCalendarProvider = {
  idUser: string;
};

export const AdminCalendarProvider = ({ idUser }: adminCalendarProvider) => {
  const { handleNotification } = useNotificationProvider();
  const { height } = Dimensions.get("window");
  const [openForm, setOpenForm] = useState(false);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [openExceptionForm, setOpenExceptionForm] = useState(false);
  const [openModalDeleteException, setOpenModalDeleteException] =
    useState(false);
  const [selectedDate, setSelectedDate] = useState<weekDaysProps>({
    day: "",
    isActive: false,
    startTime: "",
    endTime: "",
    duration: 0, // minutos
    maxReservations: 0,
    dateString: dayjs().format(FORMAT_DATE.GENERAL_EN),
  });

  const { data: dataCalendar = [], isFetching: isFetchingCalendar } = useQuery({
    queryKey: [REACT_QUERY_KEYS.calendar.calendarByUser.getByIdUser(idUser)],
    queryFn: () => apiCalendar.getCalendarByUser(idUser),
    ...{
      enabled: !!idUser,
      select: (data: ResponseApi) => data.data.items,
    },
  });

  const {
    data: dataCalendarException,
    refetch: refetchCalendarException,
    isFetching: isLoadingExceptionDay,
  } = useQuery({
    queryKey: [REACT_QUERY_KEYS.calendar.calendarException.getByUser(idUser)],
    queryFn: () =>
      apiCalendar.getCalencarExceptionByUser(
        idUser,
        convertDateToGeneralFormat(
          selectedDate?.dateString,
          FORMAT_DATE.TIME_STAMP
        )
      ),
    ...{
      enabled: Boolean(idUser && !!selectedDate?.dateString),
      select: (data: ResponseApi) => data.data.items as exceptionDayType,
    },
  });

  const { mutate: deleteCalendarException } = useMutation({
    mutationFn: (id: number) => apiCalendar.deleteCalendarException(id),
    onSuccess: (data: ResponseApi) =>
      handleSuccessDeleteCalendarException(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessDeleteCalendarException = (data: ObjectResponse) => {
    if (data.error) return ErrorAlertMessage({ message: data.message });
    handleNotification({
      type: TYPE_STATUS.SUCCESS,
      message: `Se elimino la excepcion del día ${selectedDate?.dateString}`,
    });
    setOpenModalDeleteException(false);
    refetchCalendarException();
  };

  useEffect(() => {
    refetchCalendarException();
  }, [selectedDate?.dateString]);

  useEffect(() => {
    handleSelectedDate(dayjs().format(FORMAT_DATE.GENERAL_EN));
  }, [isFetchingCalendar]);

  const handleSelectedDate = (day: string) => {
    const dateSelected = dayjs(day).format("dddd");

    const daySaved: weekDaysProps = dataCalendar.find(
      (item: weekDaysProps) =>
        item.day.toLowerCase() === dateSelected.toLowerCase()
    );
    const foundDayDefault = DEFAULT_VALUES_WEEK.find(
      (item: weekDaysProps) =>
        item.day.toLowerCase() === dateSelected.toLowerCase()
    );

    if (daySaved) {
      const updatedDay = {
        ...daySaved,
        dateString: day,
        isActive: true,
      };
      setSelectedDate(updatedDay);
    } else {
      if (foundDayDefault) {
        const defaultDay: weekDaysProps = foundDayDefault;
        defaultDay.dateString = day;
        setSelectedDate(defaultDay);
      }
    }
  };

  const handleDeleteException = () => {
    if (dataCalendarException?.id)
      return deleteCalendarException(dataCalendarException?.id);
    else
      ErrorAlertMessage({
        message: "No se selecciono la exception correctamente",
      });
  };

  return (
    <View
      style={{
        flex: 1,
        marginBottom: Platform.OS === PLATFORM_TYPE.IOS ? height * 0.06 : 0.01,
        paddingBottom:
          Platform.OS === PLATFORM_TYPE.ANDROID ? height * 0.01 : 0,
      }}
    >
      <ScrollView
        style={{
          ...localStyle.contentCalendar,
          flexGrow: 1,
        }}
      >
        <View style={localStyle.contentBtn}>
          <GeneralButton
            styleBtn={ButtonGeneralStyle.btnSaveSthetic}
            styleText={TextStyle.fontBoldWhite}
            textBtn={"Crear cita"}
            handleOnPress={() => setOpenScheduleModal(true)}
          />
          <GeneralButton
            styleBtn={ButtonGeneralStyle.btnActionSthetic}
            styleText={TextStyle.fontBoldWhite}
            textBtn="Horario semanal"
            handleOnPress={() => setOpenForm((v) => !v)}
          />
        </View>
        <Calendar
          onDayPress={(day: any) => handleSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate?.dateString as string]: {
              selected: true,
              selectedColor: ThemeColorsSthetic.accent,
            },
          }}
        />
        <View
          style={{
            flex: 1,
            marginBottom: Platform.OS === PLATFORM_TYPE.IOS ? 0 : 10,
          }}
        >
          <View style={{ ...GridStyle.rowSpaceBetween, marginTop: 10 }}>
            <View style={localStyle.contentDateSelected}>
              <View>
                <ThemedText style={TextStyle.label}>
                  Día seleccionado:{" "}
                </ThemedText>
                <ThemedText style={TextStyle.value}>
                  {selectedDate?.dateString || "ninguno"}
                </ThemedText>
              </View>
            </View>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <GeneralButton
                styleBtn={ButtonGeneralStyle.btnActionSthetic}
                styleText={TextStyle.fontBoldWhite}
                textBtn={
                  !dataCalendarException
                    ? "Agregar excepción"
                    : "Editar excepción"
                }
                handleOnPress={() => setOpenExceptionForm((v) => !v)}
              />
              {dataCalendarException && (
                <GeneralButton
                  styleBtn={localStyle.btnDelete}
                  styleText={TextStyle.bold}
                  textBtn={<Feather name="trash" size={24} color="white" />}
                  handleOnPress={() => setOpenModalDeleteException((v) => !v)}
                />
              )}
            </View>
          </View>
          {isLoadingExceptionDay ? (
            <LoadingView />
          ) : (
            dataCalendarException && <ExceptionDay {...dataCalendarException} />
          )}

          <AvailibleWeek
            open={openForm}
            handleCloseModal={() => setOpenForm((v) => !v)}
            idUser={idUser}
            daysByweek={dataCalendar}
          />
        </View>
        {selectedDate && (
          <MakeExceptionDay
            open={openExceptionForm}
            day={selectedDate}
            idUser={idUser}
            handleCloseModal={() => setOpenExceptionForm((v) => !v)}
            entityToEdit={dataCalendarException}
          />
        )}
        {openScheduleModal && selectedDate?.dateString && (
          <MakeScheduleDate
            open={openScheduleModal}
            handleCloseModal={() => setOpenScheduleModal(false)}
            selectedDate={{
              day: selectedDate.day,
              dateString: selectedDate.dateString,
            }}
            idUser={idUser}
          />
        )}
        <ModalConfirm
          open={openModalDeleteException}
          handleClose={() => setOpenModalDeleteException((v) => !v)}
          handleConfirm={handleDeleteException}
          title="Advertencia"
          message="¿Estás seguro de querer borrar la exception del día?"
          IconModal={<Feather name="trash" size={35} color="black" />}
        />
      </ScrollView>
    </View>
  );
};

export const localStyle = StyleSheet.create({
  contentCalendar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  contentBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  contentDateSelected: {
    flexDirection: "row",
    alignItems: "center",
  },
  btnDelete: {
    ...ButtonGeneralStyle.btnDeleteSthetic,
    marginLeft: 5,
  },
});

export default AdminCalendarProvider;
