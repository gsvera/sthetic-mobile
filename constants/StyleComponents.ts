import { StyleSheet } from "react-native";
import { GlobalColors } from "./Colors";

/**
 * @deprecated Viejos estilos, mejor utilizar ButtonGeneralStyle
 */
export const ButtonStyle = {
    btnSuccess: {
        color: GlobalColors.blueSuccessColor
    },
    btnInfo: {
        color: GlobalColors.cianColor
    },
    btnDisabled: {
        color: GlobalColors.grayColor
    },
    contentBtn: {
         marginTop: 20, paddingHorizontal: 20 
    }
}

export const ButtonGeneralStyle = StyleSheet.create({
    btnSuccess: {
        backgroundColor: GlobalColors.blueSuccessColor,
        paddingVertical: 5,
        paddingHorizontal:10,
        alignItems: 'center',
        borderRadius: 3,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    btnInfo: {
        backgroundColor: GlobalColors.cianColor,
        paddingVertical: 5,
        paddingHorizontal:10,
        alignItems: 'center',
        borderRadius: 3,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    btnCancel: {
        backgroundColor: GlobalColors.grayColor,
        paddingVertical: 5,
        paddingHorizontal:10,
        alignItems: 'center',
        borderRadius: 3,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    btnAction: {
        backgroundColor: GlobalColors.blueColor,
        paddingVertical: 5,
        paddingHorizontal:10,
        alignItems: 'center',
        borderRadius: 3,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    btnBig: {
        width: '48%'
    }
})

export const TextStyle = StyleSheet.create({
    fontBoldDark: {
        color: GlobalColors.blackColor,
        fontWeight: 'bold'
    },
    darkColor: {
        color: GlobalColors.blackColor
    },
    lightColor: {
        color: GlobalColors.whiteColor
    },
    blueColor: {
        color: GlobalColors.blueColor
    },
    redColor: {
        color: GlobalColors.dangerColor
    },
    bold: {
        fontWeight: 'bold'
    },
    center: {
        textAlign: 'center'
    },
    size20: {
        fontSize: 20
    },
    size40: {
        fontSize: 40
    }
})

export const InputStyle = StyleSheet.create({
    withBorder: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        padding: 10,
    },
    bigBox: {
        height: 100
    }
})


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

export const GridStyle = StyleSheet.create({
    rowSpaceBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
      }
})
 export const MarginStyle = StyleSheet.create({
    marginT10: {
        marginTop: 10
    }
 })