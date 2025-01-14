import { GlobalColors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../../ThemedText";

export default function SuccessNotification() {
  return (
    <View style={localStyles.backgroundContent}>
      <View style={localStyles.body}>
        <AntDesign
          name="checkcircle"
          size={60}
          color={GlobalColors.whiteColor}
        />
        <ThemedText type="subtitle" style={localStyles.textSuccess}>
          Su cuenta ha sido creada con exito
        </ThemedText>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  backgroundContent: {
    backgroundColor: GlobalColors.greenColor,
    width: "100%",
    height: "100%",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    position: "fixed",
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  textSuccess: {
    color: GlobalColors.whiteColor,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
  },
});
