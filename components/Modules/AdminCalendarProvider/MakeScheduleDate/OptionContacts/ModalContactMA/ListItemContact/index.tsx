import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { apiSchedule } from "@/api/Schedule";
import GeneralButton from "@/components/Shared/GeneralButton";
import ModalConfirm from "@/components/Shared/ModalConfirm";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { TempClientType } from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type listItemContactProps = {
  item: TempClientType;
  onSelect: (item: TempClientType) => void;
};

export const ListItemContact = ({ item, onSelect }: listItemContactProps) => {
  const queryClient = useQueryClient();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { mutate: deleteTempContact } = useMutation({
    mutationFn: () => apiSchedule.deleteTempClient(item.id, item.idProvider),
    onSuccess: (data: ResponseApi) => handleSucessDeleteTempContact(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSucessDeleteTempContact = (data: ObjectResponse) => {
    if (!data.error) {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.schedule.getTempClients(item.idProvider)],
      });
    }
  };

  const handleDelete = () => {
    deleteTempContact();
  };

  return (
    <View style={localStyle.container}>
      <TouchableOpacity onPress={() => onSelect(item)}>
        <ThemedText style={localStyle.textName}>
          {item.tempNameClient}
        </ThemedText>
        <ThemedText style={localStyle.textPhone}>
          {item.tempPhoneClient}
        </ThemedText>
      </TouchableOpacity>
      <View>
        <GeneralButton
          textBtn={
            <Feather
              name="trash"
              size={24}
              color={ThemeColorsSthetic.textLight}
            />
          }
          styleText={TextStyle.fontBoldWhite}
          styleBtn={localStyle.btnDelete}
          handleOnPress={() => setShowConfirmDelete(true)}
        />
      </View>
      <ModalConfirm
        open={showConfirmDelete}
        title="Eliminar contacto"
        message={`¿Estás seguro de querer eliminar el contacto de ${item.tempNameClient}?`}
        IconModal={
          <AntDesign
            name="warning"
            size={35}
            color={ThemeColorsSthetic.dangerColor}
          />
        }
        handleClose={() => setShowConfirmDelete(false)}
        handleConfirm={handleDelete}
      />
    </View>
  );
};

const localStyle = StyleSheet.create({
  container: {
    ...GridStyle.rowSpaceBetween,
    ...GridStyle.rowItemsVerticalCenter,
    borderBottomWidth: 1,
    borderRadius: 2,
    marginVertical: 1,
    padding: 10,
  },
  textName: {
    ...TextStyle.value,
    fontSize: 18,
  },
  textPhone: {
    ...TextStyle.textNote,
    fontSize: 15,
  },
  btnDelete: {
    ...ButtonGeneralStyle.btnDeleteSthetic,
    paddingTop: 6,
  },
});

export default ListItemContact;
