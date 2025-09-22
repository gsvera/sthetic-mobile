import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet } from "react-native";

type subHeaderReturnProps = {
  subtitle: string;
  handleReturn: () => void;
};

export const SubHeaderReturn = ({
  subtitle,
  handleReturn,
}: subHeaderReturnProps) => {
  return (
    <View style={localStyle.content}>
      <TouchableOpacity
        style={localStyle.touchSubtitle}
        onPress={() => handleReturn()}
      >
        <AntDesign
          name="arrow-left"
          size={24}
          color={ThemeColorsSthetic.textOre}
        />
        <View style={{ marginLeft: 10 }}>
          <ThemedText type="subtitle" style={localStyle.subtitle}>
            {subtitle}
          </ThemedText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const localStyle = StyleSheet.create({
  content: {
    height: 80,
    backgroundColor: ThemeColorsSthetic.backgroundStrong,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
  },
  touchSubtitle: {
    flexDirection: "row",
    alignItems: "center",
    left: 20,
  },
  subtitle: {
    color: ThemeColorsSthetic.textOre,
  },
});

export default SubHeaderReturn;
