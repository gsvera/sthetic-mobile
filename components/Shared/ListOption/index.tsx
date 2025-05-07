import { ThemedText } from "@/components/ThemedText";
import { OptionSelectType } from "@/constants/GeneralTypes";
import { TextStyle } from "@/constants/StyleComponents";
import { StyleSheet, TouchableOpacity } from "react-native";

export const ListOption = ({ value, label, onSelect }: OptionSelectType) => {
  return (
    <TouchableOpacity
      style={localStyle.listOption}
      onPress={() => onSelect(value)}
    >
      <ThemedText style={TextStyle.valueSelect}>{label}</ThemedText>
    </TouchableOpacity>
  );
};

const localStyle = StyleSheet.create({
  listOption: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
});

export default ListOption;
