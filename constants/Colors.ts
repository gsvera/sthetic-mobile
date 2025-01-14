/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { StyleSheet } from "react-native";

const tintColorLight = '#dc0088';
const tintColorDark = '#dc0088';

export enum GlobalColors {
  pinkColor = "#dc0088",
  blueColor = "#003a85",
  grayColor = "#5e5e5e",
  grayLigthColor = '#b8b8b8',
  cianColor = "#007BFF",
  blackColor = "black",
  whiteColor = 'white',
  greenColor = "#20c81b",
  blueSuccessColor =  '#081229',
  successNotification = '#20c81b',
  updateNotification = '#3867fc',
  errorNotification = '#ff4d4d'
}

export const textColors = {
  errors: {
    color: 'red'
  },
  pink: {
    color: "#dc0088"
  }
}

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Container = {
  container: {
    flex: 1
  },
  containerLogin: {
    flex: 1,
  },
  logo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
}

export const loginStyle = StyleSheet.create({
  centerInput: {
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  input: {
    textAlign: 'center',
    width: 250,
    height: 37,
    padding: 0,
    fontSize: 15,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#003a85',
    borderRadius: 3
  },
  buttonSubmit: {
    width: 250,
    margin: 'auto'
  },
  textInteraction: {
    textAlign: 'center',
    marginTop: 15,
    color: GlobalColors.pinkColor
  },
  errors: {
    color: 'red'
  }
})

