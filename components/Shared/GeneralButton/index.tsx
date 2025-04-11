import { ThemedText } from "@/components/ThemedText";
import { TouchableOpacity } from "react-native";

type generalButtonProps = {
  styleBtn: {};
  textBtn: string | React.ReactNode;
  styleText: {};
  handleOnPress: (value?: any) => void;
};

export const GeneralButton = ({
  styleBtn,
  textBtn,
  styleText,
  handleOnPress,
}: generalButtonProps) => {
  return (
    <TouchableOpacity style={styleBtn} onPress={handleOnPress}>
      <ThemedText style={styleText}>{textBtn}</ThemedText>
    </TouchableOpacity>
  );
};

export default GeneralButton;
