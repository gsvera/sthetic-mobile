import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";
import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { PLATFORM_TYPE, TYPE_STATUS } from "@/constants/Constants";
import { CatalogService, modalCustomProps } from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  GeneralStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { apiMenuService } from "@/api/MenuService";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { convertStringToNumber } from "@/utils/GeneralUtils";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";

type formServiceCatalogType = {
  nameService: string;
  price: number;
  people: number;
};

type createServiceModalProps = modalCustomProps & {
  idMenuService?: number;
};

export const CreateServiceModal = ({
  open,
  handleCloseModal,
  idUser,
  idMenuService,
}: createServiceModalProps) => {
  const queryClient = useQueryClient();
  const { handleNotification } = useNotificationProvider();
  const [serviceMenu, setServiceMenu] = useState<formServiceCatalogType>({
    nameService: "",
    price: 0,
    people: 1,
  });

  const { data: entityToEdit } = useQuery({
    queryKey: [REACT_QUERY_KEYS.menuServices.getServiceById(idMenuService)],
    queryFn: () => apiMenuService.getMenuServiceById(idMenuService),
    ...{
      select: (data: ResponseApi) => data.data.items as CatalogService,
      enabled: !!idMenuService,
    },
  });

  useEffect(() => {
    if (entityToEdit) {
      setServiceMenu({
        nameService: entityToEdit.nameService,
        price: entityToEdit.price,
        people: entityToEdit.people,
      });
    }
  }, [entityToEdit]);

  const { mutate: saveMenuService } = useMutation({
    mutationFn: (data: any) => apiMenuService.saveMenuService(data),
    onSuccess: (data: ResponseApi) => handleSuccessSaveMenuService(data.data),
    onError: ErrorAlertMessage,
  });

  const { mutate: updateMenuService } = useMutation({
    mutationFn: (data: any) => apiMenuService.updateMenuService(data),
    onSuccess: (data: ResponseApi) => handleSuccessSaveMenuService(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessSaveMenuService = (data: ObjectResponse) => {
    if (data.error)
      return handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });
    queryClient.invalidateQueries({
      queryKey: [REACT_QUERY_KEYS.menuServices.getByUserId(idUser)],
    });
    if (entityToEdit) {
      handleNotification({
        type: TYPE_STATUS.UPDATE,
        message: data.message,
      });
    } else {
      handleNotification({
        type: TYPE_STATUS.SUCCESS,
        message: data.message,
      });
    }
    onCloseModal();
  };

  const disableBtn = useMemo(
    () => !serviceMenu.nameService,
    [serviceMenu.nameService]
  );

  const saveService = () => {
    console.log(serviceMenu);
    if (!entityToEdit) {
      saveMenuService({
        ...serviceMenu,
        idUser,
      });
    } else {
      updateMenuService({
        ...serviceMenu,
        idUser,
        id: idMenuService,
      });
    }
  };

  const onCloseModal = () => {
    setServiceMenu({
      nameService: "",
      price: 0,
      people: 1,
    });
    handleCloseModal();
  };

  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="fade"
      onRequestClose={onCloseModal}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={localStyle.modalView}>
          <View style={localStyle.contentModal}>
            <View>
              <ButtonCloseModal handleOnPress={onCloseModal} />
              <ThemedText style={localStyle.titleModal}>
                {entityToEdit ? "Editar servicio" : "Agregar servicio"}
              </ThemedText>
            </View>

            <View style={localStyle.contentForm}>
              <View style={localStyle.formInput}>
                <ThemedText style={localStyle.label}>
                  * Nombre del servicio
                </ThemedText>
                <TextInput
                  style={localStyle.input}
                  onChangeText={(value) =>
                    setServiceMenu((prev) => ({ ...prev, nameService: value }))
                  }
                  value={serviceMenu.nameService}
                />
              </View>
              <View style={localStyle.formInput}>
                <ThemedText style={localStyle.label}>Precio</ThemedText>
                <TextInput
                  style={localStyle.input}
                  keyboardType="numeric"
                  onChangeText={(value) =>
                    setServiceMenu((prev) => ({
                      ...prev,
                      price: convertStringToNumber(value),
                    }))
                  }
                  value={serviceMenu.price.toString()}
                />
              </View>
              <View style={localStyle.formInput}>
                <ThemedText style={localStyle.label}>Personas</ThemedText>
                <TextInput
                  style={localStyle.input}
                  defaultValue="1"
                  keyboardType="numeric"
                  onChangeText={(value) =>
                    setServiceMenu((prev) => ({
                      ...prev,
                      people: convertStringToNumber(value),
                    }))
                  }
                  value={serviceMenu.people.toString()}
                />
              </View>
              <View style={localStyle.contentBtn}>
                <GeneralButton
                  textBtn="Guardar"
                  styleText={TextStyle.fontBoldWhite}
                  styleBtn={ButtonGeneralStyle.btnSaveSthetic}
                  handleOnPress={saveService}
                  disabledBtn={disableBtn}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: ThemeColorsSthetic.shadowBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  btnclose: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
    marginBottom: 5,
    paddingRight: 10,
  },
  titleModal: {
    color: ThemeColorsSthetic.textTitle,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: Platform.OS === PLATFORM_TYPE.ANDROID ? 24 : 20,
    paddingTop: 3,
    marginTop: -15,
    marginBottom: 15,
  },
  contentModal: {
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    width: "80%",
  },
  contentForm: {
    paddingHorizontal: 10,
  },
  formInput: {
    marginBottom: Platform.OS === PLATFORM_TYPE.ANDROID ? 10 : 15,
  },
  input: {
    ...GeneralStyle.simpleInput,
    height: 30,
  },
  label: {
    ...TextStyle.label,
    marginBottom: Platform.OS === PLATFORM_TYPE.ANDROID ? 0 : 10,
  },
  contentBtn: {
    marginTop: 10,
    marginBottom: 15,
  },
});

export default CreateServiceModal;
