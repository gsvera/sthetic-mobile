import {
  Button,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { formProjectToImgtype, modalCustomFormProps } from "../types";
import { SimpleLineIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Controller, useForm } from "react-hook-form";
import {
  ButtonStyle,
  GeneralStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import {
  GlobalColors,
  textColors,
  ThemeColorsSthetic,
} from "@/constants/Colors";
import { StyleSheet } from "react-native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { requestGalleryPermission } from "@/hooks/usePermissionRequest";
import * as FileSystem from "expo-file-system";
import { getBase64FromVideo } from "@/utils/GeneralUtils";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";

const schema = yup.object().shape({
  nameService: yup.string().required("Campo obligatorio"),
  minPrice: yup.number(),
  maxPrice: yup.number(),
});

/**
 * Este componente sera para un futuro como vaya creciendo el proyecto ya que el peso de los videos puede ser un problema a corto plazo, y se requiere servicios externos para su gestion
 * @param param0
 * @returns
 */

export const UploadVideoModal = ({
  open,
  handleCloseModal,
  handleSave,
  idUser,
}: modalCustomFormProps) => {
  const [videoSelected, setVideoSelected] =
    useState<ImagePicker.ImagePickerAsset | null>();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<formProjectToImgtype>({
    resolver: yupResolver(schema),
  });

  const disableBtn = useMemo(
    () => !videoSelected || !watch("nameService"),
    [videoSelected, watch("nameService")]
  );

  // Esta funcion es para cargar archivos desde el dispositivo
  const showFileManager = async () => {
    const hasPermission = await requestGalleryPermission();

    if (!hasPermission) {
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: true,
      // aspect: [4, 3],
      // allowsMultipleSelection: true,
      // selectionLimit: 1,
      quality: 0.5,
    });

    if (!result?.canceled) {
      // setVideoSelected(
      //   result.assets.map((item, index) => ({ ...item, key: index }))
      // );
      const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
      if (fileInfo.exists && fileInfo?.size > 5 * 1024 * 1024) {
        alert("El archivo es demasiado grande (máx. 5MB)");
        return;
      }
      const base64video = await getBase64FromVideo(result.assets[0].uri);
      setVideoSelected({
        ...result.assets[0],
        base64: `data:video/mp4;base64,${base64video}`,
      });
    } else {
      console.info("El usuario canceló la selección.");
    }
  };

  const handleClose = () => {
    handleCloseModal();
    reset();
  };

  const handleSaveCatalogUserService = async (data: formProjectToImgtype) => {
    try {
      handleSave({
        ...data,
        idUser,
        items: [{ fileBase64: videoSelected?.base64 }],
      });
    } catch (error) {
      ErrorAlertMessage({});
    }
  };

  return (
    <Modal animationType="slide" transparent={false} visible={open}>
      <View style={localStyle.headClose}>
        <TouchableOpacity onPress={handleClose}>
          <SimpleLineIcons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
        <ThemedText style={localStyle.labelInput}>
          * Descripción del video
        </ThemedText>
        <Controller
          control={control}
          name="nameService"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={GeneralStyle.simpleInput}
              placeholder="Agregue una descripción"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              maxLength={200}
            />
          )}
        />
        {errors.nameService && (
          <Text style={TextStyle.textError}>{errors.nameService.message}</Text>
        )}
      </View>
      <View style={{ paddingHorizontal: 15 }}>
        <View style={{ paddingBottom: 10 }}>
          <ThemedText style={{ ...localStyle.labelInput, textAlign: "center" }}>
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
              <ThemedText darkColor="black">De:</ThemedText>
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
              <ThemedText darkColor="black">A:</ThemedText>
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
        <Button
          title="Abrir galeria"
          color={ThemeColorsSthetic.action}
          onPress={showFileManager}
        />
      </View>
      <View style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap" }}>
        <View style={localStyle.contentImg}>
          <Pressable
            style={localStyle.removeIconImg}
            onPress={() => setVideoSelected(null)}
          >
            <SimpleLineIcons name="close" size={24} color="white" />
          </Pressable>
          <Image
            style={localStyle.imgSelected}
            source={{ uri: videoSelected?.uri }}
          />
        </View>
      </View>
      <View style={ButtonStyle.contentBtn}>
        <Button
          title="Guardar"
          color={
            disableBtn
              ? ButtonStyle.btnDisabled.color
              : ButtonStyle.btnSuccess.color
          }
          disabled={disableBtn}
          onPress={handleSubmit(handleSaveCatalogUserService)}
        />
      </View>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  headClose: {
    paddingTop: 20,
    paddingRight: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  contentImg: {
    width: 100,
    height: 100,
    margin: 10,
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
    color: GlobalColors.blueColor,
    fontWeight: "bold",
  },
});

export default UploadVideoModal;
