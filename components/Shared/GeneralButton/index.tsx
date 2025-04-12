import { ThemedText } from "@/components/ThemedText";
import { TouchableOpacity } from "react-native";

type generalButtonProps = {
  styleBtn: {};
  textBtn: string | React.ReactNode;
  styleText?: {};
  disabledBtn?: boolean;
  handleOnPress: (value?: any) => void;
};

export const GeneralButton = ({
  styleBtn,
  textBtn,
  styleText,
  handleOnPress,
  disabledBtn = false,
}: generalButtonProps) => {
  return (
    <TouchableOpacity
      style={styleBtn}
      onPress={handleOnPress}
      disabled={disabledBtn}
    >
      <ThemedText style={styleText}>{textBtn}</ThemedText>
    </TouchableOpacity>
  );
};

export default GeneralButton;
