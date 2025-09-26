import GeneralButton from "@/components/Shared/GeneralButton";
import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import {
  ButtonGeneralStyle,
  GeneralStyle,
  InputStyle,
  MarginStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { requestGalleryPermission } from "@/hooks/usePermissionRequest";
import { MaterialIcons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import * as yup from "yup";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiUserConfig from "@/api/UserConfig";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { PLATFORM_TYPE, TYPE_STATUS } from "@/constants/Constants";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { InfoCompanyType } from "@/constants/GeneralTypes";
import LoadingView from "@/components/Shared/LoadingView";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";

type myCompanyProps = {
  idUser: string;
  returnBack: () => void;
};

type formCompanyInfo = {
  companyName?: string;
  generalDescription?: string;
  facebook?: string;
  instagram?: string;
  webPage?: string;
};

const schema = yup.object().shape({
  companyName: yup.string(),
  generalDescription: yup.string(),
  facebook: yup.string(),
  instagram: yup.string(),
  webPage: yup.string(),
});

export const MyCompany = ({ idUser, returnBack }: myCompanyProps) => {
  const { handleNotification } = useNotificationProvider();
  const {
    control,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm<formCompanyInfo>({
    resolver: yupResolver(schema),
  });
  const [companyPicture, setCompanyPicture] = useState<string | undefined>(
    undefined
  );

  const { data: dataInfoCompany, isFetching: isFetchingInfoCompany } = useQuery(
    {
      queryKey: [REACT_QUERY_KEYS.userConfig.getInfoCompanyByUer(idUser)],
      queryFn: () => apiUserConfig.getInfoCompany(idUser),
      ...{
        select: (data: ResponseApi) => data.data.items as InfoCompanyType,
      },
    }
  );

  const { mutate: updateInfoCompany } = useMutation({
    mutationFn: (data: any) => apiUserConfig.updateInfoCompany(data),
    onSuccess: (data: ResponseApi) => handleSuccessUpdateInfoCompany(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessUpdateInfoCompany = (data: ObjectResponse) => {
    if (data.error)
      return handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });
    handleNotification({
      type: TYPE_STATUS.SUCCESS,
      message: data.message,
    });
    returnBack();
  };

  useEffect(() => {
    if (dataInfoCompany) {
      reset({
        companyName: dataInfoCompany?.companyName,
        generalDescription: dataInfoCompany?.generalDescription,
        facebook: dataInfoCompany?.facebook,
        instagram: dataInfoCompany?.instagram,
        webPage: dataInfoCompany?.webPage,
      });
      if (dataInfoCompany.companyPictureUrl)
        setCompanyPicture(dataInfoCompany.companyPictureUrl);
    }
  }, [isFetchingInfoCompany]);

  const disableBtn = useMemo(
    () => !watch("companyName") || !watch("generalDescription"),
    [watch("companyName"), watch("generalDescription")]
  );

  // Esta funcion es para cargar archivos desde el dispositivo
  const showFileManager = async () => {
    const hasPermission = await requestGalleryPermission();

    if (!hasPermission) {
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      selectionLimit: 1,
      quality: 0.5,
    });

    if (!result?.canceled) {
      setCompanyPicture(result?.assets?.[0].uri);
    } else {
      console.info("El usuario canceló la selección.");
    }
  };

  const handleSaveInfoCompany = async () => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: companyPicture,
        type: "image/png",
        name: `company-picture_${Date.now()}_${idUser}.jpg`,
      } as any);
      formData.append(
        "infoCompanyDTOJson",
        JSON.stringify({
          ...getValues(),
          idUser,
        })
      );
      updateInfoCompany(formData);
    } catch (Exception) {
      ErrorAlertMessage({});
    }
  };

  return (
    <View>
      <SubHeaderReturn
        subtitle="Información de negocio"
        handleReturn={returnBack}
      />
      {isFetchingInfoCompany ? (
        <View style={MarginStyle.marginT100}>
          <LoadingView />
        </View>
      ) : (
        <ScrollView style={{ height: "85%" }}>
          <View>
            <Pressable
              style={{
                width: "100%",
                height: 150,
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: ThemeColorsSthetic.backgroundLight,
              }}
              onPress={showFileManager}
            >
              {!companyPicture ? (
                <MaterialIcons
                  name="add-photo-alternate"
                  size={30}
                  color={ThemeColorsSthetic.accentReverse}
                />
              ) : (
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={{ uri: companyPicture }}
                />
              )}
            </Pressable>
          </View>
          <View style={localStyle.contentForm}>
            <View style={{ width: "80%", paddingTop: 20 }}>
              <View style={{ marginVertical: 10 }}>
                <ThemedText style={localStyle.label}>
                  * Nombre del negocio
                </ThemedText>
                <Controller
                  control={control}
                  name="companyName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={GeneralStyle.simpleInput}
                      placeholder="Ingrese el nombre de tu negocio"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      maxLength={255}
                    />
                  )}
                />
                {errors.companyName && (
                  <ThemedText style={TextStyle.textError}>
                    {errors.companyName.message}
                  </ThemedText>
                )}
              </View>
              <View style={{ marginVertical: 10 }}>
                <ThemedText style={localStyle.label}>
                  * Descripción de tu servicio
                </ThemedText>
                <Controller
                  control={control}
                  name="generalDescription"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <View style={localStyle.descriptionBox}>
                        <TextInput
                          placeholder="Ingrese una breve descripción de sus servicios"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          multiline
                          numberOfLines={5}
                          maxLength={5000}
                        />
                      </View>
                      <ThemedText style={localStyle.suffix}>
                        {value?.length}/5000
                      </ThemedText>
                    </>
                  )}
                />
                {errors.generalDescription && (
                  <ThemedText style={TextStyle.textError}>
                    {errors.generalDescription.message}
                  </ThemedText>
                )}
              </View>
              <View style={{ marginVertical: 10 }}>
                <ThemedText style={localStyle.label}>Facebook</ThemedText>
                <Controller
                  control={control}
                  name="facebook"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={GeneralStyle.simpleInput}
                      placeholder="Ingrese la url del facebook de tu negocio"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      maxLength={255}
                    />
                  )}
                />
              </View>
              <View style={{ marginVertical: 10 }}>
                <ThemedText style={localStyle.label}>Instagram</ThemedText>
                <Controller
                  control={control}
                  name="instagram"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={GeneralStyle.simpleInput}
                      placeholder="Ingrese la url del instagram de tu negocio"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      maxLength={255}
                    />
                  )}
                />
              </View>
              <View style={{ marginVertical: 10 }}>
                <ThemedText style={localStyle.label}>Página web</ThemedText>
                <Controller
                  control={control}
                  name="webPage"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={GeneralStyle.simpleInput}
                      placeholder="Ingrese la url de la página web de tu negocio"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      maxLength={255}
                    />
                  )}
                />
              </View>
            </View>
          </View>
          <View style={localStyle.contentBtn}>
            <GeneralButton
              textBtn="Guardar"
              styleText={TextStyle.fontBoldWhite}
              styleBtn={ButtonGeneralStyle.btnSaveSthetic}
              handleOnPress={handleSaveInfoCompany}
              disabledBtn={disableBtn}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const localStyle = StyleSheet.create({
  contentForm: {
    justifyContent: "center",
    flexDirection: "row",
  },
  label: {
    ...TextStyle.label,
    marginBottom: Platform.OS === PLATFORM_TYPE.IOS ? 10 : 0,
  },
  descriptionBox: {
    ...InputStyle.withBorder,
    height: 115,
    marginTop: Platform.OS === PLATFORM_TYPE.ANDROID ? 10 : 0,
    paddingBottom: Platform.OS === PLATFORM_TYPE.ANDROID ? 15 : 25,
  },
  contentBtn: {
    width: "80%",
    marginHorizontal: "auto",
    marginVertical: 15,
  },
  suffix: {
    color: ThemeColorsSthetic.muted,
    fontSize: 15,
    textAlign: "right",
    marginTop: -25,
    marginRight: 10,
  },
});
export default MyCompany;
