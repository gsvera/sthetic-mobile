import { ThemedText } from "@/components/ThemedText";
import { GlobalColors } from "@/constants/Colors";
import { ButtonGeneralStyle, TextStyle } from "@/constants/StyleComponents";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

type modalConfirmProps = {
  open: boolean;
  title?: string;
  message?: string;
  textBtnConfirm?: string;
  handleClose: () => void;
  handleConfirm: () => void;
  IconModal?: JSX.Element;
};

export const ModalConfirm = ({
  open,
  title,
  message,
  handleClose,
  handleConfirm,
  IconModal,
  textBtnConfirm,
}: modalConfirmProps) => {
  return (
    <Modal animationType="slide" transparent={true} visible={open}>
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
            <ThemedText style={TextStyle.darkColor}>{message}</ThemedText>
          )}
          <View style={localStyle.contentBtns}>
            <TouchableOpacity
              style={{
                ...ButtonGeneralStyle.btnCancel,
                ...ButtonGeneralStyle.btnBig,
              }}
              onPress={handleClose}
            >
              <ThemedText>Cancelar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...ButtonGeneralStyle.btnSuccess,
                ...ButtonGeneralStyle.btnBig,
              }}
              onPress={handleConfirm}
            >
              <ThemedText>{textBtnConfirm || "Confirmar"}</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  modalView: {
    flex: 1,
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
    ...TextStyle.fontBoldDark,
    ...TextStyle.center,
    ...TextStyle.size20,
    marginBottom: 10,
  },
  contentBtns: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
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
