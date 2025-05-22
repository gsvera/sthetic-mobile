import ListOption from "@/components/Shared/ListOption";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { LadaType, modalCustomProps } from "@/constants/GeneralTypes";
import { ModalStyle } from "@/constants/StyleComponents";
import { Modal, StyleSheet, View } from "react-native";

type ladaOptionModalProps = modalCustomProps & {
  listLada: Array<LadaType>;
  handleSelect: (data: LadaType) => void;
};

export const LadaOptionModal = ({
  open,
  handleCloseModal,
  handleSelect,
  listLada,
}: ladaOptionModalProps) => {
  return (
    <Modal visible={open} transparent={true} animationType="fade">
      <View
        style={ModalStyle.modalView}
        onStartShouldSetResponder={() => {
          handleCloseModal();
          return false;
        }}
      >
        <View style={localStyle.contentModal}>
          {listLada.map((item) => (
            <ListOption
              key={item.id}
              value={item.id}
              label={`${item.lada} ${item.code}`}
              onSelect={() => handleSelect(item)}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  contentModal: {
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    padding: 10,
  },
});

export default LadaOptionModal;
