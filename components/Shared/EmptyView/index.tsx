import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { TextStyle } from "@/constants/StyleComponents";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export const EmptyView = () => {
  return (
    <View style={localStyle.emptyComponent}>
      <MaterialCommunityIcons
        name="clipboard-text-search-outline"
        style={localStyle.icon}
      />
      <ThemedText style={TextStyle.textNote}>
        No se encontraron registros
      </ThemedText>
    </View>
  );
};

const localStyle = StyleSheet.create({
  emptyComponent: {
    marginHorizontal: "auto",
  },
  icon: {
    color: ThemeColorsSthetic.muted,
    fontSize: 45,
    marginHorizontal: "auto",
  },
});

export default EmptyView;
