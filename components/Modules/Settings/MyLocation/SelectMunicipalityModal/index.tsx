import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";
import ListOption from "@/components/Shared/ListOption";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import {
  CatalogGeoMunicipalityType,
  modalCustomProps,
} from "@/constants/GeneralTypes";
import { GridStyle, ModalStyle, TextStyle } from "@/constants/StyleComponents";

import { Modal, ScrollView, StyleSheet, View } from "react-native";

type selectMunicipalityModalProps = modalCustomProps & {
  listMunicipality: Array<CatalogGeoMunicipalityType>;
  handleSelect: (data: CatalogGeoMunicipalityType) => void;
};

export const SelectMunicipalityModal = ({
  open,
  handleCloseModal,
  listMunicipality,
  handleSelect,
}: selectMunicipalityModalProps) => {
  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
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
            <ThemedText style={localStyle.label}>
              Seleccione un municipio
            </ThemedText>
            <ButtonCloseModal handleOnPress={handleCloseModal} />
          </View>
          <ScrollView>
            {listMunicipality.map((item) => (
              <ListOption
                key={item.id}
                value={item.id}
                label={item.municipalityName}
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
    minHeight: "20%",
    maxHeight: "60%",
  },
  label: {
    ...TextStyle.label,
    marginRight: 15,
  },
});

export default SelectMunicipalityModal;
