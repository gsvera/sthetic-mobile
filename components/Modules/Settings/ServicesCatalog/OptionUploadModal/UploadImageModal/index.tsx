import { ButtonStyle, GeneralStyle } from "@/constants/StyleComponents";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { modalCustomFormProps } from "../types";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useMemo, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import * as ImagePicker from "expo-image-picker";
import { requestGalleryPermission } from "@/hooks/usePermissionRequest";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { GlobalColors, textColors } from "@/constants/Colors";
import ImageWithOptions from "@/components/Shared/ImageWithOptions";

type formProjectToImgtype = {
  nameService: string;
  minPrice?: number;
  maxPrice?: number;
};

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
  idUser,
}: modalCustomFormProps) => {
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<formProjectToImgtype>({
    resolver: yupResolver(schema),
  });

  const [listImage, setListImage] = useState<customImagePickerAsset[] | []>([]);

  const disableBtn = useMemo(
    () => listImage.length === 0 || !getValues("nameService"),
    [listImage, getValues("nameService")]
  );

  // Esta funcion es para cargar archivos desde el dispositivo
  const showFileManager = async () => {
    const hasPermission = await requestGalleryPermission();

    if (!hasPermission) {
      return;
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
      setListImage(
        result.assets.map((item, index) => ({ ...item, key: index }))
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
      const imgList = listImage.map((item) => ({
        fileBase64: `data:image/png;base64,${item.base64}`,
      }));
      handleSave({
        ...data,
        idUser,
        items: imgList,
      });
    } catch (err) {
      ErrorAlertMessage();
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
        <ThemedText style={localStyle.labelInput}>* Descripción</ThemedText>
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
          <Text style={textColors.errors}>{errors.nameService.message}</Text>
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
          color={ButtonStyle.btnInfo.color}
          onPress={showFileManager}
        />
      </View>
      <View style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap" }}>
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

export default UploadImageModal;
