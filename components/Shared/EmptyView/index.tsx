import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { TextStyle } from "@/constants/StyleComponents";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type emptyViewPrps = {
  message?: string;
};

export const EmptyView = ({
  message = "No se encontraron registros",
}: emptyViewPrps) => {
  return (
    <View style={localStyle.emptyComponent}>
      <MaterialCommunityIcons
        name="clipboard-text-search-outline"
        style={localStyle.icon}
      />
      <ThemedText style={TextStyle.textNote}>{message}</ThemedText>
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
