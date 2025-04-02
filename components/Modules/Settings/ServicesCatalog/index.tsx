import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "@/components/ThemedText";
import { GlobalColors } from "@/constants/Colors";
import { functionServicesType } from "../types";
import { useCallback, useState } from "react";
import { OptionUploadModal } from "./OptionUploadModal";
import { UploadImageModal } from "./OptionUploadModal/UploadImageModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import apiCatalogUserService from "@/api/CatalogUserService";
import PreviewCard, { previewCardProps } from "@/components/Shared/PreviewCard";
import LoadingView from "@/components/Shared/LoadingView";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { TYPE_STATUS } from "@/constants/Constants";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import ModalConfirm from "@/components/Shared/ModalConfirm";
import { fileTypes } from "@/constants/GeneralTypes";
import UploadVideoModal from "./OptionUploadModal/UploadVideoModal";
import { ButtonGeneralStyle } from "@/constants/StyleComponents";

/**
 * ESTE ARCHIVO TIENE COMENTADO LAS OPCIONES PARA SUBIR VIDEO PARA UN FUTURO
 * @param param0
 * @returns
 */

export const ServicesCatalog = ({
  returnBack,
  idUser,
}: functionServicesType) => {
  const { handleNotification } = useNotificationProvider();
  // const [openModalOption, setOpenModalOption] = useState(false);
  const [openModalUpload, setOpenModalUpload] = useState<fileTypes>(null);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [idSelected, setIdSelected] = useState(0);

  const {
    data: listCatalogServices = [],
    isPending: isPendingLoad,
    refetch: refetchGetProject,
  } = useQuery({
    queryKey: [
      REACT_QUERY_KEYS.catalogs.services.getByUserId(idUser as string),
    ],
    queryFn: () => apiCatalogUserService.getCatalogServiceByUser(idUser),
    ...{
      select: (data: ResponseAPi) => data.data.items,
    },
  });

  const { mutate: saveCatalogService } = useMutation({
    mutationFn: (data: any) => apiCatalogUserService.saveCatalogService(data),
    onSuccess: (data: ResponseAPi) =>
      handleSuccessSaveCatalogService(data.data),
    onError: (err) => ErrorAlertMessage,
  });

  const { mutate: updateCatalogService } = useMutation({
    mutationFn: (data: any) => apiCatalogUserService.updateCatalogService(data),
    onSuccess: (data: ResponseAPi) =>
      handleSuccessUpdateCatalogService(data.data),
    onError: (err) => ErrorAlertMessage,
  });

  const { mutate: deleteProject } = useMutation({
    mutationFn: (data: any) => apiCatalogUserService.deleteProject(data),
    onSuccess: (data: ResponseAPi) => handleSuccessDeleteProject(data.data),
    onError: (err) => ErrorAlertMessage,
  });

  const handleSuccessSaveCatalogService = (data: ObjectResponse) => {
    if (data.error) return ErrorAlertMessage({ message: data.message });

    refetchGetProject();
    handleNotification({
      type: TYPE_STATUS.SUCCESS,
      message: data.message,
    });
    handleOpenTypeModalUpload(null);
  };

  const handleSuccessUpdateCatalogService = (data: ObjectResponse) => {
    if (data.error) return ErrorAlertMessage({ message: data.message });
    refetchGetProject();
    handleNotification({
      type: TYPE_STATUS.UPDATE,
      message: data.message,
    });
    handleOpenTypeModalUpload(null);
  };

  const handleSuccessDeleteProject = (data: ObjectResponse) => {
    if (data.error) return ErrorAlertMessage({ message: data.message });

    refetchGetProject();
    handleNotification({
      type: TYPE_STATUS.SUCCESS,
      message: data.message,
    });
  };

  const handleSelectDeleteProject = (id: number) => {
    setIdSelected(id);
    setOpenModalConfirm(true);
  };

  // const handleOpenModalOption = () => {
  //   setOpenModalOption((v) => !v);
  // };

  const handleOpenTypeModalUpload = (data: fileTypes = null) => {
    // handleOpenModalOption();
    setIdSelected(0);
    setOpenModalUpload(data);
  };

  const handleOpenModalConfirm = useCallback(() => {
    setIdSelected(0);
    setOpenModalConfirm((v) => !v);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteProject(idSelected);
    setOpenModalConfirm(false);
  }, [idSelected]);

  const openEditProject = useCallback(
    (idProject: number) => {
      setIdSelected(idProject);
      setOpenModalUpload("image");
    },
    [idSelected]
  );

  return (
    <View>
      <SubHeaderReturn
        subtitle="Catálogo de servicios"
        handleReturn={returnBack}
      />
      <View style={localStyle.contentBtnAdd}>
        <TouchableOpacity
          style={ButtonGeneralStyle.btnAction}
          // onPress={handleOpenModalOption} // Cuando mejore el proyecto habilitaremos la opcion de subir videos ;-)
          onPress={() => handleOpenTypeModalUpload("image")}
        >
          <View style={localStyle.btnContent}>
            <ThemedText
              lightColor="white"
              style={{
                fontWeight: "bold",
              }}
            >
              Agregar portafolio{"  "}
            </ThemedText>
            <MaterialIcons name="add-photo-alternate" size={22} color="white" />
          </View>
        </TouchableOpacity>
      </View>
      {isPendingLoad ? (
        <LoadingView />
      ) : (
        <ScrollView style={localStyle.scrollViewGallery}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {listCatalogServices?.map((item: previewCardProps) => (
              <PreviewCard
                key={item.id}
                id={item.id}
                nameService={item.nameService}
                minPrice={item.minPrice}
                maxPrice={item.maxPrice}
                totalElement={item.totalElement}
                catalogUserServiceDetailDTO={item.catalogUserServiceDetailDTO}
                deleteProject={handleSelectDeleteProject}
                editProject={openEditProject}
              />
            ))}
          </View>
        </ScrollView>
      )}

      <UploadImageModal
        open={openModalUpload === "image"}
        handleCloseModal={handleOpenTypeModalUpload}
        idUser={idUser}
        handleSave={saveCatalogService}
        handleUpdate={updateCatalogService}
        idEntity={idSelected}
      />
      {/* 
        Cuando mejore el proyecto habilitaremos la opcion de subir videos ;-) 
      */}
      {/* <OptionUploadModal
          open={openModalOption}
          handleCloseModal={handleOpenModalOption}
          handleOpenTypeModalUpload={handleOpenTypeModalUpload}
        /> */}
      {/* <UploadVideoModal
        open={openModalUpload === "video"}
        handleCloseModal={handleOpenTypeModalUpload}
        idUser={idUser}
        handleSave={saveCatalogService}
      /> */}
      <ModalConfirm
        open={openModalConfirm}
        handleClose={handleOpenModalConfirm}
        handleConfirm={handleConfirmDelete}
        message="¿Estás seguro de eliminar el projecto, esta acción no se podra revertir?"
      />
    </View>
  );
};

const localStyle = StyleSheet.create({
  contentBtnAdd: {
    justifyContent: "flex-end",
    flexDirection: "row",
    marginTop: 10,
    marginRight: 10,
  },
  btnAddProject: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 2,
    backgroundColor: GlobalColors.blueColor,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollViewGallery: {
    height: "80%",
    paddingHorizontal: 10,
    marginTop: 10,
  },
});

export default ServicesCatalog;
