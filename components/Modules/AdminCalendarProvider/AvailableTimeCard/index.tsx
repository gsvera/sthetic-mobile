import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { weekDaysProps } from "../types";
import { GridStyle, TextStyle } from "@/constants/StyleComponents";
import { ThemedText } from "@/components/ThemedText";
import { Switch } from "react-native";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { TextInput } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { REGEX } from "@/constants/Constants";
import dayjs from "dayjs";
import { convertHourToAMorPM } from "@/utils/GeneralUtils";

type availebleTimeCardProps = {
  day: weekDaysProps;
  updateDataDay: (day: weekDaysProps) => void;
};

export const AvailableTimeCard = ({
  day,
  updateDataDay,
}: availebleTimeCardProps) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState({
    daySelected: "",
    position: "",
  });

  const handleEnabledDayToWork = (isChecked: boolean) => {
    day.isActive = isChecked;
    updateDataDay(day);
  };

  const handleShowTimePicker = (position: string) => {
    setShowTimePicker(true);
    setSelectedDay({ daySelected: day.day, position });
  };

  const handleTimeAppointment = (value: string) => {
    const timeByReservation = REGEX.ONLY_NUMBER.test(value)
      ? parseInt(value)
      : 0;
    day.duration = timeByReservation;
    updateDataDay(day);
  };

  const handleMaxReservations = (value: string) => {
    const numMaxReservations = REGEX.ONLY_NUMBER.test(value)
      ? parseInt(value)
      : 0;
    day.maxReservations = numMaxReservations;
    updateDataDay(day);
  };

  const handleChageTime = (e: any) => {
    if (selectedDay.position === "start")
      day.startTime = dayjs(e).format("HH:mm");
    else day.endTime = dayjs(e).format("HH:mm");

    updateDataDay(day);
    setShowTimePicker(false);
  };

  return (
    <View style={localStyle.cardItem}>
      <View style={localStyle.cardHeader}>
        <ThemedText style={localStyle.titleDay}>{day.day}</ThemedText>
        <Switch value={day.isActive} onValueChange={handleEnabledDayToWork} />
      </View>
      {day.isActive && (
        <>
          <View style={GridStyle.rowSpaceBetween}>
            <View style={localStyle.cardRowItem}>
              <Pressable onPress={() => handleShowTimePicker("start")}>
                <ThemedText style={TextStyle.label}>
                  Hora inicio:{" "}
                  {!day.startTime && (
                    <Feather name="alert-circle" size={24} color="red" />
                  )}
                </ThemedText>
                <ThemedText style={TextStyle.value}>
                  {day.startTime && convertHourToAMorPM(day.startTime)}
                </ThemedText>
              </Pressable>
            </View>
            <View style={localStyle.cardRowItem}>
              <Pressable onPress={() => handleShowTimePicker("end")}>
                <ThemedText style={TextStyle.label}>
                  Hora fin:{" "}
                  {!day.endTime && (
                    <Feather name="alert-circle" size={24} color="red" />
                  )}
                </ThemedText>
                <ThemedText style={TextStyle.value}>
                  {day.endTime && convertHourToAMorPM(day.endTime)}
                </ThemedText>
              </Pressable>
            </View>
          </View>
          <View style={{ ...GridStyle.rowSpaceBetween, marginTop: 10 }}>
            <View style={localStyle.cardRowItem}>
              <ThemedText style={TextStyle.label}>
                Duración (min) promedio citas:{" "}
                {day.duration === 0 && (
                  <Feather name="alert-circle" size={24} color="red" />
                )}
              </ThemedText>
              <TextInput
                value={day.duration.toString()}
                keyboardType="numeric"
                onChangeText={(text) => handleTimeAppointment(text)}
                style={localStyle.inputCard}
              />
            </View>
            <View style={localStyle.cardRowItem}>
              <ThemedText style={TextStyle.label}>
                Máx citas por rango de tiempo:{" "}
                {day.maxReservations === 0 && (
                  <Feather name="alert-circle" size={24} color="red" />
                )}
              </ThemedText>
              <TextInput
                value={day.maxReservations.toString()}
                keyboardType="numeric"
                onChangeText={(text) => handleMaxReservations(text)}
                style={localStyle.inputCard}
              />
            </View>
          </View>
        </>
      )}
      <DateTimePickerModal
        isVisible={showTimePicker}
        mode="time"
        onConfirm={handleChageTime}
        onCancel={() => setShowTimePicker(false)}
      />
    </View>
  );
};

const localStyle = StyleSheet.create({
  cardHeader: {
    ...GridStyle.rowSpaceBetween,
    ...GridStyle.rowItemsVerticalCenter,
  },
  cardItem: {
    marginBottom: 20,
    padding: 30,
    borderColor: ThemeColorsSthetic.text,
    borderWidth: 0.2,
    borderRadius: 5,
  },
  titleDay: {
    ...TextStyle.size20,
    color: ThemeColorsSthetic.textTitle,
    fontWeight: "bold",
  },
  cardRowItem: {
    width: "45%",
  },
  inputCard: {
    ...TextStyle.value,
    borderBottomWidth: 1,
    marginVertical: 6,
  },
});
export default AvailableTimeCard;
