import { StyleSheet } from "react-native";
import { GlobalColors } from "./Colors";

export const ButtonStyle = {
    btnSuccess: {
        color: GlobalColors.blueSuccessColor
    },
    btnDisabled: {
        color: GlobalColors.grayColor
    }
}

export const GeneralStyle = StyleSheet.create({
    simpleInput: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "gray",
        paddingHorizontal: 10,
    }
})