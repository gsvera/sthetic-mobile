import { Alert } from "react-native";

export const ErrorAlertMessage = (
  message = "Ocurrió un error al realizar la solicitud, favor de intentarlo mas tarde"
) => {
  return Alert.alert("Advertencia", message, [
    {
      text: "Cerrar",
      style: "cancel",
    },
  ]);
};

type propsPromtConfirm = {
  title: string;
  message: string;
  textBtnCancel: string;
  textBtnConfirm: string;
  handleConfirmAction: () => void;
};

export const PromtConfirm = (props: propsPromtConfirm) => {
  return Alert.alert(props.title, props.message, [
    {
      text: props.textBtnCancel,
      style: "cancel",
    },
    {
      text: props.textBtnConfirm,
      onPress: props.handleConfirmAction,
    },
  ]);
};
