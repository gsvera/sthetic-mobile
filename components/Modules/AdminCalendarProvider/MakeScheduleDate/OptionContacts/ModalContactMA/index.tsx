import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ResponseApi } from "@/api/responseApi";
import { apiSchedule } from "@/api/Schedule";
import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";
import EmptyView from "@/components/Shared/EmptyView";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { modalCustomProps, TempClientType } from "@/constants/GeneralTypes";
import { TextStyle } from "@/constants/StyleComponents";
import { useQuery } from "@tanstack/react-query";
import { Modal, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ListItemContact from "./ListItemContact";
import { useMemo, useState } from "react";
import LoadingView from "@/components/Shared/LoadingView";

type modalContactMAProps = modalCustomProps & {
  onSelectContact: (item: TempClientType) => void;
};

export const ModalContactMA = ({
  open,
  handleCloseModal,
  idUser,
  onSelectContact,
}: modalContactMAProps) => {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const { data: tempClientList = [], isLoading } = useQuery({
    queryKey: [REACT_QUERY_KEYS.schedule.getTempClients(idUser)],
    queryFn: () => apiSchedule.getTempClients(idUser),
    ...{
      select: (data: ResponseApi) => data.data.items as TempClientType[],
      enabled: !!idUser,
    },
  });

  const listContact = useMemo(
    () =>
      searchText === ""
        ? tempClientList
        : tempClientList.filter(
            (item) =>
              item.tempNameClient
                .toLowerCase()
                .match(searchText.toLowerCase()) ||
              item.tempPhoneClient.toLowerCase().match(searchText.toLowerCase())
          ),
    [tempClientList, searchText]
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={handleCloseModal}
    >
      <View
        style={{
          ...localStyle.modalContainer,
          top: insets.top,
          flex: 1,
          bottom: insets.bottom,
        }}
      >
        <View style={localStyle.container}>
          <ButtonCloseModal handleOnPress={handleCloseModal} />
          <ThemedText style={TextStyle.titleModal}>
            Clientes guardados
          </ThemedText>
          <TextInput
            style={localStyle.inputSearch}
            placeholder="Buscar..."
            placeholderTextColor={ThemeColorsSthetic.text}
            onChangeText={setSearchText}
          />
          <ScrollView>
            {isLoading ? (
              <LoadingView />
            ) : listContact.length > 0 ? (
              listContact.map((item: TempClientType) => (
                <ListItemContact
                  key={item.id}
                  item={item}
                  onSelect={onSelectContact}
                />
              ))
            ) : (
              <View style={{ marginTop: 100 }}>
                <EmptyView />
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  modalContainer: {
    backgroundColor: ThemeColorsSthetic.shadowBackground,
  },
  container: {
    padding: 20,
    marginTop: 30,
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    height: "80%",
  },
  inputSearch: {
    ...TextStyle.value,
    borderWidth: 1,
    borderRadius: 2,
    height: 40,
    padding: 10,
    marginTop: 10,
  },
});
export default ModalContactMA;
