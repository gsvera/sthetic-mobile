import {
  Button,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { modalCustomProps } from "../types";
import { SimpleLineIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Controller, useForm } from "react-hook-form";
import { ButtonStyle, GeneralStyle } from "@/constants/StyleComponents";
import { GlobalColors, textColors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";

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

export const UploadVideoModal = ({
  open,
  handleCloseModal,
  idUser,
}: modalCustomProps) => {
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<formProjectToImgtype>({
    resolver: yupResolver(schema),
  });

  const disableBtn = useMemo(() => false, []);

  const handleClose = () => {};

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
          // onPress={showFileManager}
        />
      </View>
      <View style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap" }}>
        {/* <View key={item.key} style={localStyle.contentImg}>
        <Pressable
          style={localStyle.removeIconImg}
          onPress={() => handleRemovePicture(item.key)}
        >
          <SimpleLineIcons name="close" size={24} color="white" />
        </Pressable>
        <Image style={localStyle.imgSelected} source={{ uri: item.uri }} />
      </View> */}
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
          // onPress={handleSubmit(handleSaveCatalogUserService)}
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
