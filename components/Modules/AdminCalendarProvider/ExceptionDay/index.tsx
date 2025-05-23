import { exceptionDayType } from "../types";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { GridStyle, MarginStyle, TextStyle } from "@/constants/StyleComponents";
import { StyleSheet, View } from "react-native";
import { convertHourToAMorPM } from "../../../../utils/GeneralUtils";

export const ExceptionDay = (exceptionDay: exceptionDayType) => {
  return (
    <View>
      <View style={MarginStyle.marginT10}>
        <ThemedText style={localStyle.textTitle}>Excepción activa</ThemedText>
      </View>
      <View style={localStyle.rowElement}>
        <ThemedText style={TextStyle.label}>Estatus:</ThemedText>
        <ThemedText style={TextStyle.value}>
          {exceptionDay.isActive ? "Abierto" : "Cerrado"}
        </ThemedText>
      </View>
      {exceptionDay.isActive && (
        <View>
          <View style={localStyle.rowElement}>
            <ThemedText style={TextStyle.label}>Inicio:</ThemedText>
            <ThemedText style={TextStyle.value}>
              {convertHourToAMorPM(exceptionDay.startTime)}
            </ThemedText>
          </View>
          <View style={localStyle.rowElement}>
            <ThemedText style={TextStyle.label}>Fin:</ThemedText>
            <ThemedText style={TextStyle.value}>
              {convertHourToAMorPM(exceptionDay.endTime)}
            </ThemedText>
          </View>
          <View style={localStyle.rowElement}>
            <ThemedText style={TextStyle.label}>
              Duración (min) promedio citas:
            </ThemedText>
            <ThemedText style={TextStyle.value}>
              {exceptionDay.duration}
            </ThemedText>
          </View>
          <View style={localStyle.rowElement}>
            <ThemedText style={TextStyle.label}>
              Máx citas por rango de tiempo:
            </ThemedText>
            <ThemedText style={TextStyle.value}>
              {exceptionDay.maxReservations}
            </ThemedText>
          </View>
        </View>
      )}
      <View style={localStyle.borderComments}>
        <ThemedText style={TextStyle.label}>Comentarios:</ThemedText>
        <ThemedText style={TextStyle.value}>{exceptionDay.comments}</ThemedText>
      </View>
    </View>
  );
};

const localStyle = StyleSheet.create({
  textTitle: {
    ...TextStyle.center,
    ...TextStyle.size20,
    color: ThemeColorsSthetic.text,
    fontWeight: "bold",
  },
  rowElement: {
    ...GridStyle.rowSpaceBetween,
    marginTop: 5,
  },
  borderComments: {
    marginTop: 10,
    borderTopWidth: 1,
  },
});

export default ExceptionDay;
