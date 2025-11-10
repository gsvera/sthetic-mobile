import { ThemedText } from "@/components/ThemedText";
import { GlobalColors, ThemeColorsSthetic } from "@/constants/Colors";
import { ButtonGeneralStyle, TextStyle } from "@/constants/StyleComponents";
import { Modal, StyleSheet, View } from "react-native";
import GeneralButton from "../GeneralButton";
import LoadingView from "../LoadingView";

type modalConfirmProps = {
  open: boolean;
  title?: string;
  message?: string;
  textBtnConfirm?: string;
  handleClose: () => void;
  handleConfirm: () => void;
  IconModal?: JSX.Element;
  isLoading?: boolean;
};

export const ModalConfirm = ({
  open,
  title,
  message,
  handleClose,
  handleConfirm,
  IconModal,
  textBtnConfirm,
  isLoading,
}: modalConfirmProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={handleClose}
    >
      <View
        style={localStyle.modalView}
        onStartShouldSetResponder={() => {
          handleClose();
          return false;
        }}
      >
        <View style={localStyle.contentModal}>
          {IconModal && (
            <View style={localStyle.contetIconModal}>{IconModal}</View>
          )}
          {title && (
            <ThemedText style={localStyle.textTitle}>{title}</ThemedText>
          )}
          {message && (
            <ThemedText style={localStyle.textMessage}>{message}</ThemedText>
          )}
          <View style={localStyle.contentBtns}>
            <GeneralButton
              styleBtn={localStyle.btnCancel}
              styleText={TextStyle.fontBoldWhite}
              handleOnPress={handleClose}
              textBtn="Cancelar"
              disabledBtn={isLoading}
              styleBtndisable={localStyle.btnDisabled}
            />
            <GeneralButton
              styleBtn={localStyle.btnConfirm}
              styleText={TextStyle.fontBoldWhite}
              handleOnPress={handleConfirm}
              textBtn={textBtnConfirm || "Confirmar"}
              disabledBtn={isLoading}
              styleBtndisable={localStyle.btnDisabled}
            />
            {isLoading && <LoadingView />}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: ThemeColorsSthetic.shadowBackground, // <-- fondo negro con opacidad
    justifyContent: "center",
    alignItems: "center",
  },
  contentModal: {
    width: "80%",
    margin: "auto",
    backgroundColor: GlobalColors.whiteColor,
    padding: 15,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textTitle: {
    ...TextStyle.center,
    ...TextStyle.size20,
    ...TextStyle.bold,
    color: ThemeColorsSthetic.textLabels,
    marginBottom: 10,
  },
  textMessage: {
    color: ThemeColorsSthetic.text,
  },
  contentBtns: {
    marginTop: 20,
    marginBottom: 10,
  },
  btnCancel: {
    ...ButtonGeneralStyle.btnCancelSthetic,
    marginBottom: 10,
  },
  btnConfirm: {
    ...ButtonGeneralStyle.btnSaveSthetic,
  },
  btnDisabled: {
    ...ButtonGeneralStyle.btnDisabledSthetic,
    marginBottom: 10,
  },
  contetIconModal: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 15,
  },
});

export default ModalConfirm;
