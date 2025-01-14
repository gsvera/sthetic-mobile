import { ThemedText } from "@/components/ThemedText";
import { GlobalColors } from "@/constants/Colors";
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
        <AntDesign name="arrowleft" size={24} color={GlobalColors.whiteColor} />
        <View style={{ marginLeft: 10 }}>
          <ThemedText type="subtitle">{subtitle}</ThemedText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const localStyle = StyleSheet.create({
  content: {
    height: 80,
    backgroundColor: GlobalColors.pinkColor,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
  },
  touchSubtitle: {
    flexDirection: "row",
    alignItems: "center",
    left: 20,
  },
});

export default SubHeaderReturn;
