import { ThemeColorsSthetic } from "@/constants/Colors";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

type buttonCloseModalProps = {
  handleOnPress: () => void;
  styleButton?: {};
};

export const ButtonCloseModal = ({
  handleOnPress,
  styleButton,
}: buttonCloseModalProps) => {
  return (
    <View style={styleButton ?? localStyle.contentHeader}>
      <Pressable onPress={handleOnPress}>
        <SimpleLineIcons
          name="close"
          size={24}
          color={ThemeColorsSthetic.accentReverse}
        />
      </Pressable>
    </View>
  );
};

const localStyle = StyleSheet.create({
  contentHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    marginBottom: 5,
    paddingRight: 10,
  },
});
export default ButtonCloseModal;
