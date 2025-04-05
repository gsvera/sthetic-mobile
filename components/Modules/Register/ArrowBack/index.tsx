import { GlobalColors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

type arrowBackProps = {
  view: number;
  handleReturn: (value: number) => void;
};

export const ArrowBack = ({ view, handleReturn }: arrowBackProps) => {
  return (
    <TouchableOpacity
      style={{ position: "fixed", left: 20, marginBottom: -25 }}
      onPress={() => handleReturn(view)}
    >
      <AntDesign name="arrowleft" size={24} color={GlobalColors.blackColor} />
    </TouchableOpacity>
  );
};

export default ArrowBack;
