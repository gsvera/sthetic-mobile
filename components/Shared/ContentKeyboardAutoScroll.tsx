import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

interface Props {
  children: React.ReactNode;
}

export const ContentKeyboardAutoScroll: React.FC<Props> = ({ children }) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback
      onPress={dismissKeyboard}
      style={localStyles.Container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={localStyles.ScrollContainer}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const localStyles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  ScrollContainer: {
    padding: 20,
    flexGrow: 1, // Asegura que el contenido ocupe todo el espacio
    justifyContent: "center",
  },
});

export default ContentKeyboardAutoScroll;
