import {
  ButtonGeneralStyle,
  GeneralStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { formProjectToImgtype, modalCustomFormProps } from "../types";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useEffect, useMemo, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import * as ImagePicker from "expo-image-picker";
import { requestGalleryPermission } from "@/hooks/usePermissionRequest";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ThemeColorsSthetic } from "@/constants/Colors";
import ImageWithOptions from "@/components/Shared/ImageWithOptions";
import { useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import apiCatalogUserService from "@/api/CatalogUserService";
import { MAX_LENGTH } from "@/constants/Constants";
import LoadingView from "@/components/Shared/LoadingView";
import GeneralButton from "@/components/Shared/GeneralButton";
import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";
import { ResponseApi } from "@/api/responseApi";

const schema = yup.object().shape({
  nameService: yup.string().required("Campo obligatorio"),
  minPrice: yup.number(),
  maxPrice: yup.number(),
});

// Se agrega la key solo como identificador para el array
type customImagePickerAsset = ImagePicker.ImagePickerAsset & {
  key: number;
};

export const UploadImageModal = ({
  open,
  handleCloseModal,
  handleSave,
  handleUpdate,
  idUser,
  idEntity,
}: modalCustomFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<formProjectToImgtype>({
    resolver: yupResolver(schema),
  });
  const [listImage, setListImage] = useState<customImagePickerAsset[] | []>([]);

  const { data: entityToEdit = null, isPending: isPendingData } = useQuery({
    queryKey: [
      REACT_QUERY_KEYS.catalogs.services.getToEdit(idEntity as number),
    ],
    queryFn: () => apiCatalogUserService.getToEditCatalogService(idEntity),
    ...{
      enabled: !!idEntity,
      select: (data: ResponseApi) => data.data.items,
    },
  });

  useEffect(() => {
    if (entityToEdit) {
      setValue("nameService", entityToEdit.nameService);
      setValue("minPrice", entityToEdit.minPrice);
      setValue("maxPrice", entityToEdit.maxPrice);
      setListImage(
        entityToEdit.detail?.map((item: any, index: number) => ({
          ...item,
          key: index,
          uri: item.fileBase64,
        }))
      );
    }
  }, [entityToEdit]);

  const loadingData = useMemo(
    () => idEntity && isPendingData,
    [idEntity, isPendingData]
  );

  const disableBtn = useMemo(
    () => listImage.length === 0 || !watch("nameService"),
    [listImage, watch("nameService")]
  );

  // Esta funcion es para cargar archivos desde el dispositivo
  const showFileManager = async () => {
    const hasPermission = await requestGalleryPermission();

    if (!hasPermission) {
      return;
    }

    if (listImage.length >= MAX_LENGTH.MAX_FILE_TO_UPLOAD) {
      return ErrorAlertMessage({
        message: `Solo puedes cargar un maximo de ${MAX_LENGTH.MAX_FILE_TO_UPLOAD} archivos`,
      });
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing: true,
      // aspect: [4, 3],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.5,
      base64: true,
    });

    if (!result?.canceled) {
      const arrImageSelected = [
        ...listImage,
        ...result.assets.map((item) => ({
          ...item,
          fileBase64: `data:image/png;base64,${item.base64}`,
        })),
      ];

      setListImage(
        arrImageSelected
          .slice(0, MAX_LENGTH.MAX_FILE_TO_UPLOAD)
          .map((item, index) => ({ ...item, key: index }))
      );
    } else {
      console.info("El usuario canceló la selección.");
    }
  };

  const handleClose = () => {
    setListImage([]);
    handleCloseModal();
    reset();
  };

  const handleRemovePicture = (id: any) => {
    const newArray = listImage.filter((item) => item.key !== id);
    setListImage(newArray);
  };

  const handleSaveCatalogUserService = async (data: formProjectToImgtype) => {
    try {
      if (idEntity) {
        handleUpdate?.({
          ...data,
          id: idEntity,
          idUser,
          items: listImage,
        });
      } else {
        handleSave({
          ...data,
          idUser,
          items: listImage,
        });
      }

      handleClose();
    } catch (err) {
      ErrorAlertMessage({});
    }
  };

  return (
    <Modal animationType="slide" transparent={false} visible={open}>
      <ButtonCloseModal handleOnPress={handleClose} />
      {loadingData ? (
        <LoadingView />
      ) : (
        <View>
          <ThemedText style={localStyle.titleModal}>
            {!idEntity
              ? "Agregar portafolio de servicio"
              : "Editar portafolio de servicio"}
          </ThemedText>
          <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
            <ThemedText style={localStyle.labelInput}>
              * Descripción de la galeria
            </ThemedText>
            <Controller
              control={control}
              name="nameService"
              render={({ field: { onChange, onBlur, value } }) => (
                // <View style={InputStyle.withBorder}>
                <TextInput
                  style={GeneralStyle.simpleInput}
                  placeholder="Agregue una descripción o nombre"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  maxLength={100}
                />
              )}
            />
            {errors.nameService && (
              <Text style={TextStyle.textError}>
                {errors.nameService.message}
              </Text>
            )}
          </View>
          <View style={{ paddingHorizontal: 15 }}>
            <View style={{ paddingBottom: 10 }}>
              <ThemedText
                style={{ ...localStyle.labelInput, textAlign: "center" }}
              >
                Rango de precios
              </ThemedText>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <View>
                  <ThemedText style={localStyle.subLabel}>De:</ThemedText>
                  <Controller
                    control={control}
                    name="minPrice"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={GeneralStyle.simpleInput}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value?.toString()}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>
              </View>
              <View style={{ width: "48%" }}>
                <View>
                  <ThemedText style={localStyle.subLabel}>A:</ThemedText>
                  <Controller
                    control={control}
                    name="maxPrice"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={GeneralStyle.simpleInput}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value?.toString()}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={localStyle.headClose}>
            <GeneralButton
              styleText={TextStyle.fontBoldWhite}
              textBtn="Abrir galeria"
              styleBtn={ButtonGeneralStyle.btnActionSthetic}
              handleOnPress={showFileManager}
            />
          </View>
          <View style={localStyle.contentListImg}>
            {listImage.map((item) => (
              <View key={item.key}>
                <ImageWithOptions
                  id={item.key}
                  deleteAction={handleRemovePicture}
                  uri={item.uri}
                />
              </View>
            ))}
          </View>
          <View style={localStyle.textNote}>
            <ThemedText style={{ ...TextStyle.darkColor, ...TextStyle.center }}>
              *Puedes cargar un maximo de {MAX_LENGTH.MAX_FILE_TO_UPLOAD}{" "}
              archivos*
            </ThemedText>
          </View>
          <View style={ButtonGeneralStyle.contentBtnSthetic}>
            <GeneralButton
              styleBtn={
                !disableBtn
                  ? ButtonGeneralStyle.btnUpdateSthetic
                  : ButtonGeneralStyle.btnDisabledSthetic
              }
              textBtn="Actualizar datos"
              styleText={{
                color: !disableBtn
                  ? ThemeColorsSthetic.textLight
                  : ThemeColorsSthetic.muted,
              }}
              handleOnPress={handleSubmit(handleSaveCatalogUserService)}
              disabledBtn={disableBtn}
            />
          </View>
        </View>
      )}
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  headClose: {
    paddingTop: 15,
    paddingRight: 15,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  titleModal: {
    ...TextStyle.titleModal,
    marginTop: 5,
    marginBottom: 20,
  },
  removeIconImg: {
    position: "absolute",
    zIndex: 2,
    alignSelf: "flex-end",
    padding: 5,
  },
  imgSelected: {
    width: "100%",
    height: "100%",
  },
  labelInput: {
    color: ThemeColorsSthetic.textLabels,
    fontWeight: "bold",
  },
  textNote: {
    marginTop: 15,
  },
  subLabel: {
    color: ThemeColorsSthetic.textLabels,
  },
  contentListImg: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  suffix: {
    color: ThemeColorsSthetic.muted,
    fontSize: 15,
    textAlign: "right",
    marginTop: -10,
  },
});

export default UploadImageModal;
