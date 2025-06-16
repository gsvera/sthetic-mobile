import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { ButtonGeneralStyle } from "@/constants/StyleComponents";
import { TouchableOpacity } from "react-native";

type generalButtonProps = {
  styleBtn: {};
  styleBtndisable?: {};
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
  styleBtndisable,
  disabledBtn = false,
}: generalButtonProps) => {
  return (
    <TouchableOpacity
      style={
        !disabledBtn
          ? styleBtn
          : styleBtndisable ?? ButtonGeneralStyle.btnDisabledSthetic
      }
      onPress={handleOnPress}
      disabled={disabledBtn}
    >
      <ThemedText style={!disabledBtn ? styleText : ThemeColorsSthetic.muted}>
        {textBtn}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default GeneralButton;
