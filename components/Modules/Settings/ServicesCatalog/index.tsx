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

export const ServicesCatalog = ({
  returnBack,
  idUser,
}: functionServicesType) => {
  const { handleNotification } = useNotificationProvider();
  const [openModalOption, setOpenModalOption] = useState(false);
  const [openModalImage, setOpenModalImage] = useState(false);
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
    onError: (err) => ErrorAlertMessage(err.message),
  });

  const { mutate: deleteProject } = useMutation({
    mutationFn: (data: any) => apiCatalogUserService.deleteProject(data),
    onSuccess: (data: ResponseAPi) => handleSuccessDeleteProject(data.data),
    onError: (err) => ErrorAlertMessage(err.message),
  });

  const handleSuccessSaveCatalogService = (data: ObjectResponse) => {
    if (data.error) return ErrorAlertMessage(data.message);

    refetchGetProject();
    handleNotification({
      type: TYPE_STATUS.SUCCESS,
      message: data.message,
    });
    handleOpenModalImage();
  };

  const handleSuccessDeleteProject = (data: ObjectResponse) => {
    if (data.error) return ErrorAlertMessage(data.message);

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

  const handleOpenModalOption = () => {
    setOpenModalOption((v) => !v);
  };

  const handleOpenModalImage = () => {
    handleOpenModalOption();
    setOpenModalImage((v) => !v);
  };

  const handleOpenModalConfirm = useCallback(() => {
    setIdSelected(0);
    setOpenModalConfirm((v) => !v);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteProject(idSelected);
    setOpenModalConfirm(false);
  }, [idSelected]);

  return (
    <View>
      <SubHeaderReturn
        subtitle="Catálogo de servicios"
        handleReturn={returnBack}
      />
      <View style={localStyle.contentBtnAdd}>
        <TouchableOpacity
          style={localStyle.btnAddProject}
          onPress={handleOpenModalOption}
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
              />
            ))}
          </View>
        </ScrollView>
      )}

      <OptionUploadModal
        open={openModalOption}
        handleCloseModal={handleOpenModalOption}
        handleOpenImageModal={handleOpenModalImage}
      />
      <UploadImageModal
        open={openModalImage}
        handleCloseModal={handleOpenModalImage}
        idUser={idUser}
        handleSave={saveCatalogService}
      />
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
    padding: 10,
  },
});

export default ServicesCatalog;
