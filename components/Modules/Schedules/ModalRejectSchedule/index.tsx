import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";
import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { modalActionCustomProps } from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  InputStyle,
  ModalStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {
  Keyboard,
  Modal,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export const ModalRejectSchedule = ({
  open,
  handleCloseModal,
  handleConfirmModal,
}: modalActionCustomProps) => {
  const [localTextReject, setLocalTextReject] = useState("");
  const [showError, setShowError] = useState(false);
  const onHandlerConfirm = () => {
    if (!localTextReject) return setShowError(true);

    handleConfirmModal(localTextReject);
    onHandlerClose();
  };

  const onHandlerClose = () => {
    setShowError(false);
    handleCloseModal();
  };
  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="fade"
      onRequestClose={onHandlerClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={ModalStyle.modalView}>
          <View style={localStyle.modalRejectSchedule}>
            <ButtonCloseModal handleOnPress={onHandlerClose} />
            <View style={localStyle.contentIcon}>
              <AntDesign name="warning" style={localStyle.icon} />
            </View>
            <ThemedText style={localStyle.text}>
              Agregue un motivo de rechazo
            </ThemedText>
            <TextInput
              style={localStyle.input}
              multiline
              numberOfLines={3}
              maxLength={250}
              value={localTextReject}
              onChangeText={setLocalTextReject}
            />
            {showError && (
              <ThemedText style={localStyle.textError}>
                Debe agregar un motivo
              </ThemedText>
            )}
            <GeneralButton
              textBtn="Rechazar"
              styleText={TextStyle.fontBoldWhite}
              styleBtn={ButtonGeneralStyle.btnActionSthetic}
              handleOnPress={onHandlerConfirm}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  modalRejectSchedule: {
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    paddingHorizontal: 10,
    paddingBottom: 15,
    width: "80%",
    borderRadius: 5,
  },
  contentIcon: {
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    fontSize: 35,
    color: ThemeColorsSthetic.dangerColor,
    marginBottom: 10,
  },
  text: {
    ...TextStyle.value,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: { ...InputStyle.withBorder, ...InputStyle.bigBox, marginBottom: 10 },
  textError: { ...TextStyle.textError, textAlign: "center", marginBottom: 10 },
});

export default ModalRejectSchedule;
