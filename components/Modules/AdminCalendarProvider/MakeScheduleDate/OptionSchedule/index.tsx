import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { TimeScheduleType } from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { convertHourToAMorPM } from "@/utils/GeneralUtils";
import { StyleSheet, View } from "react-native";

type optionScheduleProps = {
  optionSchedule: TimeScheduleType;
  onSelect: (obj: TimeScheduleType) => void;
};

export const OptionSchedule = ({
  optionSchedule,
  onSelect,
}: optionScheduleProps) => {
  return (
    <View style={localStyle.optionSchedule}>
      <View style={localStyle.content}>
        <View style={GridStyle.rowSpaceBetween}>
          <ThemedText style={TextStyle.label}>de: </ThemedText>
          <ThemedText style={TextStyle.value}>
            {convertHourToAMorPM(optionSchedule.start)}
          </ThemedText>
        </View>
        <View style={GridStyle.rowSpaceBetween}>
          <ThemedText style={TextStyle.label}>a: </ThemedText>
          <ThemedText style={TextStyle.value}>
            {" "}
            {convertHourToAMorPM(optionSchedule.end)}
          </ThemedText>
        </View>
        <GeneralButton
          textBtn="Seleccionar"
          styleText={TextStyle.fontBoldWhite}
          styleBtn={ButtonGeneralStyle.btnAction}
          handleOnPress={() => onSelect(optionSchedule)}
        />
      </View>
    </View>
  );
};

const localStyle = StyleSheet.create({
  optionSchedule: {
    marginVertical: 7,
    borderWidth: 0.5,
    borderRadius: 5,
    padding: 4,
    backgroundColor: ThemeColorsSthetic.backgroundLight,
  },
  content: {
    ...GridStyle.rowSpaceBetween,
    ...GridStyle.rowItemsVerticalCenter,
  },
});

export default OptionSchedule;
