import { Alert } from "react-native";

type ErrorAlertMessageProps = {
  title?: string;
  message?: string;
};

export const ErrorAlertMessage = ({
  title = "Advertencia",
  message = "Ocurrió un error al realizar la solicitud, favor de intentarlo mas tarde",
}: ErrorAlertMessageProps) => {
  return Alert.alert(title, message, [
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
