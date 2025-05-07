import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";
import ListOption from "@/components/Shared/ListOption";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import {
  CatalogGeoStateType,
  modalCustomProps,
} from "@/constants/GeneralTypes";
import { GridStyle, ModalStyle, TextStyle } from "@/constants/StyleComponents";
import { Modal, ScrollView, StyleSheet, View } from "react-native";

type selectStateModalProps = modalCustomProps & {
  listState: Array<CatalogGeoStateType>;
  handleSelect: (data: CatalogGeoStateType) => void;
};

export const SelectStateModal = ({
  open,
  handleCloseModal,
  listState,
  handleSelect,
}: selectStateModalProps) => {
  return (
    <Modal visible={open} animationType="fade" transparent={true}>
      <View
        style={ModalStyle.modalView}
        onStartShouldSetResponder={() => {
          handleCloseModal();
          return false;
        }}
      >
        <View style={localStyle.contentModal}>
          <View
            style={{
              ...GridStyle.rowSpaceBetween,
              ...GridStyle.rowItemsVerticalCenter,
            }}
          >
            <ThemedText style={TextStyle.label}>
              Seleccione un estado
            </ThemedText>
            <ButtonCloseModal handleOnPress={handleCloseModal} />
          </View>
          <ScrollView>
            {listState.map((item) => (
              <ListOption
                key={item.id}
                value={item.id}
                label={item.stateName}
                onSelect={() => handleSelect(item)}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  contentModal: {
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    padding: 10,
    height: "60%",
  },
});

export default SelectStateModal;
