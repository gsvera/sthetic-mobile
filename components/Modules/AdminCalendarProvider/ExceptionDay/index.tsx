import { exceptionDayType } from "../types";
import { ThemedText } from "@/components/ThemedText";
import { GridStyle, MarginStyle, TextStyle } from "@/constants/StyleComponents";
import { StyleSheet, View } from "react-native";

export const ExceptionDay = (exceptionDay: exceptionDayType) => {
  return (
    <View>
      <View style={MarginStyle.marginT10}>
        <ThemedText style={localStyle.textTitle}>Excepción activa</ThemedText>
      </View>
      <View style={localStyle.rowElement}>
        <ThemedText style={TextStyle.fontBoldBlue}>Estatus:</ThemedText>
        <ThemedText style={TextStyle.darkColor}>
          {exceptionDay.isActive ? "Abierto" : "Cerrado"}
        </ThemedText>
      </View>
      {exceptionDay.isActive && (
        <View>
          <View style={localStyle.rowElement}>
            <ThemedText style={TextStyle.fontBoldBlue}>Inicio:</ThemedText>
            <ThemedText style={TextStyle.darkColor}>
              {exceptionDay.startTime}
            </ThemedText>
          </View>
          <View style={localStyle.rowElement}>
            <ThemedText style={TextStyle.fontBoldBlue}>Fin:</ThemedText>
            <ThemedText style={TextStyle.darkColor}>
              {exceptionDay.endTime}
            </ThemedText>
          </View>
          <View style={localStyle.rowElement}>
            <ThemedText style={TextStyle.fontBoldBlue}>
              Duración (min) promedio citas:
            </ThemedText>
            <ThemedText style={TextStyle.darkColor}>
              {exceptionDay.duration}
            </ThemedText>
          </View>
          <View style={localStyle.rowElement}>
            <ThemedText style={TextStyle.fontBoldBlue}>
              Máx citas por rango de tiempo:
            </ThemedText>
            <ThemedText style={TextStyle.darkColor}>
              {exceptionDay.maxReservations}
            </ThemedText>
          </View>
        </View>
      )}
      <View style={localStyle.borderComments}>
        <ThemedText style={TextStyle.fontBoldBlue}>Comentarios:</ThemedText>
        <ThemedText style={TextStyle.darkColor}>
          {exceptionDay.comments}
        </ThemedText>
      </View>
    </View>
  );
};

const localStyle = StyleSheet.create({
  textTitle: {
    ...TextStyle.fontBoldDark,
    ...TextStyle.center,
    ...TextStyle.size20,
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
