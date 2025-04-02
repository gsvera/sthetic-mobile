import { ThemedText } from "@/components/ThemedText";
import { GlobalColors } from "@/constants/Colors";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { modalCustomProps } from "./types";
import { fileTypes } from "@/constants/GeneralTypes";

type optionsUploadModal = modalCustomProps & {
  handleOpenTypeModalUpload: (data: fileTypes) => void;
};

export const OptionUploadModal = ({
  open,
  handleCloseModal,
  handleOpenTypeModalUpload,
}: optionsUploadModal) => {
  return (
    <Modal animationType="slide" transparent={true} visible={open}>
      <View
        style={localStyle.centeredView}
        onStartShouldSetResponder={() => {
          handleCloseModal();
          return false;
        }}
      >
        <View style={localStyle.modalView}>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => handleOpenTypeModalUpload("image")}
          >
            <ThemedText style={localStyle.label} darkColor="black">
              Cargar imagen {"  "}
            </ThemedText>
            <AntDesign name="picture" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => handleOpenTypeModalUpload("video")}
          >
            <ThemedText style={localStyle.label} darkColor="black">
              Cargar video{"  "}
            </ThemedText>
            <Entypo name="folder-video" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={localStyle.button}
            onPress={handleCloseModal}
          >
            <ThemedText style={{ fontWeight: "bold" }}>Cerrar</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const localStyle = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    marginBottom: 15,
  },
  button: {
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
    elevation: 2,
    backgroundColor: GlobalColors.grayColor,
  },
});

export default OptionUploadModal;
