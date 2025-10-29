import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { functionServicesType } from "../types";
import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemedText } from "@/components/ThemedText";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { ButtonGeneralStyle, TextStyle } from "@/constants/StyleComponents";
import CreateServiceModal from "./CreateServiceModal";
import { useState } from "react";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { useMutation, useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import apiMenuService from "@/api/MenuService";
import { CatalogService } from "@/constants/GeneralTypes";
import ItemMenuService from "./ItemMenuService";
import ModalConfirm from "@/components/Shared/ModalConfirm";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { PLATFORM_TYPE, TYPE_STATUS } from "@/constants/Constants";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import LoadingView from "@/components/Shared/LoadingView";

export const CatalogServices = ({
  returnBack,
  idUser,
}: functionServicesType) => {
  const { height } = Dimensions.get("window");
  const { handleNotification } = useNotificationProvider();
  const [openCreateServiceModal, setOpenCreateServiceModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [idMenuService, setIdMenuService] = useState(0);

  const {
    data: listMenuService = [],
    refetch: refetchListMenuService,
    isFetching: isFetchingMenuServices,
  } = useQuery({
    queryKey: [REACT_QUERY_KEYS.menuServices.getByUserId(idUser)],
    queryFn: () => apiMenuService.getListMenuServicesByUser(idUser),
    ...{
      select: (data: ResponseApi) => data.data.items as Array<CatalogService>,
      enabled: !!idUser,
    },
  });

  const { mutate: deleteMenuService } = useMutation({
    mutationFn: () => apiMenuService.deleteMenuService(idUser, idMenuService),
    onSuccess: (data: ResponseApi) => handleSuccessDeleteMenuService(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessDeleteMenuService = (data: ObjectResponse) => {
    if (data.error)
      return handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });
    refetchListMenuService();
    handleNotification({
      type: TYPE_STATUS.SUCCESS,
      message: data.message,
    });
    setIdMenuService(0);
    setOpenModalDelete(false);
  };

  const handleSelectItem = (id: number) => {
    setIdMenuService(id);
    setOpenCreateServiceModal(true);
  };

  const handleCloseFormModal = () => {
    setIdMenuService(0);
    setOpenCreateServiceModal(false);
  };

  const handleOnCloseModalDelete = () => {
    setIdMenuService(0);
    setOpenModalDelete(false);
  };

  const handleOnOpenModalDelete = (id: number) => {
    setIdMenuService(id);
    setOpenModalDelete(true);
  };

  return (
    <View
      style={{
        flex: 1,
        marginBottom: Platform.OS === PLATFORM_TYPE.IOS ? height * 0.06 : 0,
      }}
    >
      <SubHeaderReturn
        subtitle="Catálogo de servicios"
        handleReturn={returnBack}
      />
      <View style={{ flex: 1 }}>
        <View style={localStyle.contentBtnAdd}>
          <GeneralButton
            styleBtn={localStyle.btnUpload}
            textBtn={
              <View style={localStyle.btnContent}>
                <View>
                  <ThemedText style={TextStyle.fontBoldWhite}>
                    Agregar servicio{"  "}
                  </ThemedText>
                </View>
                <View>
                  <MaterialIcons
                    name="library-add"
                    size={18}
                    color={ThemeColorsSthetic.textLight}
                  />
                </View>
              </View>
            }
            handleOnPress={() => setOpenCreateServiceModal(true)}
          />
        </View>
        <View style={{ paddingHorizontal: 15, marginTop: 5 }}>
          <ThemedText style={{ ...TextStyle.textNote, textAlign: "justify" }}>
            Nota: Actualmente no se realizan cobros por medio de la app,
            esperalo pronto en nuestras proximas actualizaciones
          </ThemedText>
        </View>
        {isFetchingMenuServices ? (
          <LoadingView />
        ) : (
          <ScrollView style={localStyle.contentMenuList}>
            {listMenuService.map((item) => (
              <ItemMenuService
                key={item.id}
                register={item}
                handleSelect={handleSelectItem}
                handleSelectDelete={handleOnOpenModalDelete}
              />
            ))}
          </ScrollView>
        )}
      </View>
      <CreateServiceModal
        open={openCreateServiceModal}
        handleCloseModal={handleCloseFormModal}
        idUser={idUser}
        idMenuService={idMenuService}
      />
      <ModalConfirm
        title="Eliminar Registro"
        message="¿Estás seguro de eliminar el registro, esta acción no podra revertirse?"
        IconModal={
          <Feather name="trash" size={35} color={ThemeColorsSthetic.delete} />
        }
        open={openModalDelete}
        handleClose={handleOnCloseModalDelete}
        handleConfirm={deleteMenuService}
      />
    </View>
  );
};

const localStyle = StyleSheet.create({
  btnUpload: {
    ...ButtonGeneralStyle.btnUpdateSthetic,
    width: 170,
  },
  contentBtnAdd: {
    justifyContent: "flex-end",
    flexDirection: "row",
    marginTop: 10,
    marginRight: 10,
  },
  btnContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 35,
  },
  contentMenuList: {
    flexGrow: 1,
    paddingHorizontal: 15,
    marginTop: 10,
    paddingBottom: 10,
  },
});

export default CatalogServices;
