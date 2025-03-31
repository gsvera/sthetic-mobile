import { ThemedText } from "@/components/ThemedText";
import { GlobalColors } from "@/constants/Colors";
import { ButtonGeneralStyle, TextStyle } from "@/constants/StyleComponents";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

type modalConfirmProps = {
  open: boolean;
  message: string;
  handleClose: () => void;
  handleConfirm: () => void;
};

export const ModalConfirm = ({
  open,
  message,
  handleClose,
  handleConfirm,
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
          <ThemedText style={TextStyle.fontBoldDark}>{message}</ThemedText>
          <View style={localStyle.contentBtns}>
            <TouchableOpacity
              style={{
                ...ButtonGeneralStyle.btnSuccess,
                ...ButtonGeneralStyle.btnBig,
              }}
              onPress={handleConfirm}
            >
              <ThemedText>Confirmar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...ButtonGeneralStyle.btnCancel,
                ...ButtonGeneralStyle.btnBig,
              }}
              onPress={handleClose}
            >
              <ThemedText>Cancelar</ThemedText>
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

  contentBtns: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 10,
  },
});

export default ModalConfirm;
