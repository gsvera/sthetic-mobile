import { apiCalendar } from "@/api/Calendar";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import {
  LadaType,
  MenuServiceType,
  modalCustomProps,
  ScheduleServiceType,
  TempClientType,
  TimeScheduleType,
} from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  GridStyle,
  InputStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OptionSchedule from "./OptionSchedule";
import EmptyView from "@/components/Shared/EmptyView";
import {
  FORMAT_DATE,
  REGEX,
  STATUS_SERVICE,
  TYPE_STATUS,
} from "@/constants/Constants";
import OptionService from "./OptionService";
import {
  convertCurrency,
  convertDateToGeneralFormat,
  convertHourToAMorPM,
} from "@/utils/GeneralUtils";
import GeneralButton from "@/components/Shared/GeneralButton";
import LoadingView from "@/components/Shared/LoadingView";
import { apiSchedule } from "@/api/Schedule";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ModalContactMA from "./OptionContacts/ModalContactMA";
import LadaOptionModal from "../../Register/FormRegister/LadaOptionModal";
import { apiLada } from "@/api/Lada";
import Checkbox from "expo-checkbox";

type makeScheduleDateProps = modalCustomProps & {
  selectedDate: {
    day: string;
    dateString: string;
  };
};

export const MakeScheduleDate = ({
  open,
  handleCloseModal,
  idUser,
  selectedDate,
}: makeScheduleDateProps) => {
  const insets = useSafeAreaInsets();
  const { handleNotification } = useNotificationProvider();
  const [blockTime, setBlockTime] = useState<TimeScheduleType[]>([]);
  const [selectedTime, setSelectedTime] = useState<TimeScheduleType>();
  const [selectedService, setSelectedService] = useState<MenuServiceType>();
  const [openLadaModal, setOpenLadaModal] = useState(false);
  const [ladaClient, setLadaClient] = useState<LadaType>();
  const [nameClient, setNameClient] = useState("");
  const [phoneClient, setPhoneClient] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [saveClient, setSaveClient] = useState(false);

  const { mutate: saveOurScheduleService } = useMutation({
    mutationFn: (data: ScheduleServiceType) =>
      apiSchedule.makeOurScheduleService(data),
    onSuccess: (data: ResponseApi) =>
      handleSuccessSaveOurSchedulService(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessSaveOurSchedulService = (data: ObjectResponse) => {
    if (data.error) return ErrorAlertMessage({ message: data.message });
    handleNotification({ type: TYPE_STATUS.SUCCESS, message: data.message });
    handleCloseModal();
  };

  const { data: listTimes, isLoading: isLoadingListTime } = useQuery({
    queryKey: [
      REACT_QUERY_KEYS.calendar.calendarByUser.getTimeCalendarByProvider(
        idUser as string
      ),
      selectedDate.day,
    ],
    queryFn: () =>
      apiCalendar.getTimeCalendarByPovider(
        idUser,
        selectedDate.day,
        selectedDate.dateString
      ),
    ...{
      select: (data: ResponseApi) => data.data.items,
      enabled: !!selectedDate.day,
    },
  });

  const { data: listServices = [], isLoading: isLoadingListServices } =
    useQuery({
      queryKey: [REACT_QUERY_KEYS.provider.getServicesByProvider(idUser)],
      queryFn: () => apiCalendar.getServicesByProvider(idUser),
      ...{
        select: (data: ResponseApi) => data.data.items,
        enabled: !!idUser,
      },
    });

  const { data: catalogLada = [] } = useQuery({
    queryKey: [REACT_QUERY_KEYS.lada.getFilterData("contact-schedule")],
    queryFn: () => apiLada.getFilterData(),
    ...{
      select: (data: ResponseApi) => data.data.items,
    },
  });

  useEffect(() => {
    if (listTimes) {
      setBlockTime(listTimes);
    }
  }, [listTimes]);

  const disableBtn = useMemo(
    () =>
      !selectedDate ||
      !selectedService ||
      !ladaClient ||
      phoneClient === "" ||
      nameClient === "",
    [selectedTime, selectedService, nameClient, ladaClient, phoneClient]
  );

  const handleSelectTime = (time: TimeScheduleType) => {
    setSelectedTime(time);
  };

  const clearTime = () => {
    setSelectedTime(undefined);
  };

  const clearService = () => {
    setSelectedService(undefined);
  };

  const handleSelectService = (item: MenuServiceType) => {
    setSelectedService(item);
  };

  const handleSaveSchedule = () => {
    const dateWithFormat = convertDateToGeneralFormat(
      selectedDate.dateString,
      FORMAT_DATE.TIME_STAMP
    );

    if (idUser && dateWithFormat && selectedTime && selectedService) {
      saveOurScheduleService({
        idProviderAux: idUser,
        tempNameClient: nameClient,
        tempLadaClient: ladaClient?.lada,
        tempPhoneClient: phoneClient,
        saveTempClient: saveClient,
        scheduleDate: dateWithFormat,
        startTime: selectedTime?.start,
        endTime: selectedTime?.end,
        nameService: selectedService?.nameService,
        people: selectedService?.people,
        amount: selectedService?.price,
        statusService: STATUS_SERVICE.ACCEPT,
      });
    }
  };

  const handleOnSelectLada = (data: LadaType) => {
    setLadaClient(data);
    setOpenLadaModal(false);
  };

  const handlePhoneClient = (value: string) => {
    if (value.length > 15) return;
    if (REGEX.ONLY_NUMBER.test(value)) {
      setPhoneClient(value);
    } else if (value === "") setPhoneClient(value);
    else return;
  };

  const handleSelectContactOfList = (item: TempClientType) => {
    setPhoneClient(item.tempPhoneClient);
    setNameClient(item.tempNameClient);
    setLadaClient({ lada: item.tempLadaClient, id: 0, code: "" });
    setShowContacts(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={handleCloseModal}
    >
      <View
        style={{
          ...localStyle.contentBody,
          top: insets.top,
          flex: 1,
          bottom: insets.bottom,
        }}
      >
        <ButtonCloseModal handleOnPress={handleCloseModal} />
        <View>
          <ThemedText style={localStyle.title}>
            Nueva cita {selectedDate.dateString}
          </ThemedText>
          <View style={{ height: "80%", marginBottom: 20 }}>
            <ScrollView>
              {!selectedTime ? (
                <View style={{ marginBottom: 30 }}>
                  {isLoadingListTime ? (
                    <LoadingView />
                  ) : blockTime.length > 0 ? (
                    <View>
                      <ThemedText style={localStyle.label}>
                        Selecciona un horario
                      </ThemedText>

                      {blockTime?.map((time, index: number) => (
                        <OptionSchedule
                          key={index}
                          optionSchedule={time}
                          onSelect={handleSelectTime}
                        />
                      ))}
                    </View>
                  ) : (
                    selectedDate.dateString !== "" && (
                      <View style={{ marginTop: 100 }}>
                        <EmptyView message="No tienes disponibilidad en esta fecha" />
                      </View>
                    )
                  )}
                </View>
              ) : (
                <View style={localStyle.rowData}>
                  <ThemedText style={TextStyle.label}>Horario:</ThemedText>
                  <TouchableOpacity onPress={clearTime}>
                    <ThemedText style={TextStyle.value}>
                      {`de ${convertHourToAMorPM(
                        selectedTime.start
                      )} a ${convertHourToAMorPM(selectedTime.end)}`}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}
              {!selectedService ? (
                <View>
                  {isLoadingListServices ? (
                    <LoadingView />
                  ) : listServices.length > 0 ? (
                    <View>
                      <ThemedText style={localStyle.label}>
                        Seleccione un servicio
                      </ThemedText>
                      {listServices?.map(
                        (item: MenuServiceType, index: number) => (
                          <OptionService
                            key={index}
                            service={item}
                            onSelect={handleSelectService}
                          />
                        )
                      )}
                    </View>
                  ) : (
                    <View style={{ marginTop: 100 }}>
                      <EmptyView />
                    </View>
                  )}
                </View>
              ) : (
                <TouchableOpacity onPress={clearService}>
                  <View style={localStyle.rowData}>
                    <ThemedText style={TextStyle.label}>Servicio:</ThemedText>
                    <ThemedText style={TextStyle.value}>
                      {selectedService.nameService}
                    </ThemedText>
                  </View>
                  <View style={localStyle.rowData}>
                    <ThemedText style={TextStyle.label}>
                      Cantidad de personas:
                    </ThemedText>
                    <ThemedText style={TextStyle.value}>
                      {selectedService.people}
                    </ThemedText>
                  </View>
                  <View style={localStyle.rowData}>
                    <ThemedText style={TextStyle.label}>Costo:</ThemedText>
                    <ThemedText style={TextStyle.value}>
                      {convertCurrency(selectedService.price)}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              )}
              <View>
                <GeneralButton
                  styleBtn={ButtonGeneralStyle.btnActionSthetic}
                  styleText={TextStyle.fontBoldWhite}
                  textBtn={
                    <View style={localStyle.btnContent}>
                      <ThemedText
                        lightColor="white"
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        Contactos guardados{"  "}
                      </ThemedText>
                      <FontAwesome6
                        name="contact-book"
                        size={22}
                        color="white"
                      />
                    </View>
                  }
                  handleOnPress={() => setShowContacts(true)}
                />
                <View style={{ marginTop: 10 }}>
                  <ThemedText style={TextStyle.label}>
                    Nombre del cliente:
                  </ThemedText>
                  <TextInput
                    style={localStyle.input}
                    onChangeText={setNameClient}
                    value={nameClient}
                  />
                </View>
                <View>
                  <ThemedText style={TextStyle.label}>
                    Lada y numero:
                  </ThemedText>
                  <View style={GridStyle.rowSpaceBetween}>
                    <TouchableOpacity
                      style={localStyle.contentLada}
                      onPress={() => setOpenLadaModal((v) => !v)}
                    >
                      <ThemedText style={TextStyle.value}>
                        {ladaClient?.lada ? `${ladaClient.lada}` : ""}
                      </ThemedText>
                    </TouchableOpacity>
                    <TextInput
                      style={localStyle.contentPhone}
                      onChangeText={handlePhoneClient}
                      value={phoneClient}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={localStyle.contentCheck}>
                    <Checkbox
                      value={saveClient}
                      onValueChange={(even) => setSaveClient(even)}
                    />
                    <ThemedText style={{ ...TextStyle.value, marginLeft: 5 }}>
                      Guardar cliente
                    </ThemedText>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
          <View>
            <GeneralButton
              styleBtn={ButtonGeneralStyle.btnSaveSthetic}
              styleText={TextStyle.fontBoldWhite}
              textBtn="Guardar"
              disabledBtn={disableBtn}
              handleOnPress={handleSaveSchedule}
            />
          </View>
          {showContacts && (
            <ModalContactMA
              open={showContacts}
              handleCloseModal={() => setShowContacts(false)}
              idUser={idUser}
              onSelectContact={handleSelectContactOfList}
            />
          )}
          {openLadaModal && (
            <LadaOptionModal
              open={openLadaModal}
              handleCloseModal={() => setOpenLadaModal((v) => !v)}
              listLada={catalogLada}
              handleSelect={handleOnSelectLada}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  contentBody: {
    paddingHorizontal: 15,
    backgroundColor: ThemeColorsSthetic.backgroundLight,
  },
  title: {
    color: ThemeColorsSthetic.textTitle,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    marginBottom: 15,
  },
  rowData: {
    ...GridStyle.rowSpaceBetween,
    marginVertical: 10,
  },
  label: {
    ...TextStyle.label,
    ...TextStyle.center,
    marginBottom: 10,
    fontSize: 20,
  },
  input: {
    ...InputStyle.withBorder,
    ...TextStyle.value,
    padding: 10,
    fontSize: 18,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  contentLada: {
    ...InputStyle.withBorder,
    ...TextStyle.value,
    width: "30%",
    height: 40,
    fontSize: 18,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  contentPhone: {
    ...InputStyle.withBorder,
    ...TextStyle.value,
    width: "65%",
    height: 40,
    fontSize: 18,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  contentCheck: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    // width: "85%",
    // marginHorizontal: "auto",
  },
});
