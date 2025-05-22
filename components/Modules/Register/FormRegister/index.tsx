import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import ContentKeyboardAutoScroll from "@/components/Shared/ContentKeyboardAutoScroll";
import { PLATFORM_TYPE, REGEX } from "@/constants/Constants";
import { ButtonGeneralStyle, TextStyle } from "@/constants/StyleComponents";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { apiLada } from "@/api/Lada";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";
import { apiUser } from "@/api/User";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemedText } from "@/components/ThemedText";
import { ResponseApi } from "@/api/responseApi";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { LadaType } from "@/constants/GeneralTypes";
import LadaOptionModal from "./LadaOptionModal";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("Campo obligatorio")
    .matches(REGEX.ONLY_TEXT, "Solo puede agregar letras"),
  lastName: yup
    .string()
    .required("Campo obligatorio")
    .matches(REGEX.ONLY_TEXT, "Solo puede agregar letras"),
  phone: yup
    .string()
    .required("El numero telefonico es obligatorio")
    .matches(REGEX.ONLY_NUMBER, "Solo puede agregar numeros")
    .min(10, "Debe ser al menos 10 digitos"),
  email: yup
    .string()
    .required("Campo obligatorio")
    .email("Ingrese un correo valido"),
  password: yup
    .string()
    .required("Campo obligatorio")
    .matches(
      REGEX.PASSWORD,
      "La contraseña debe incluir al menos una letra mayúscula, un número y un carácter especial"
    ),
  confirmPassword: yup
    .string()
    .required("Campo obligatorio")
    .matches(
      REGEX.PASSWORD,
      "La contraseña debe incluir minimo 8 caracteres,  al menos una letra mayúscula una minuscula, un número y un carácter especial"
    )
    .oneOf([yup.ref("password")], "Las contraseñas deben coincidir"),
});

type PropsFormRegister = {
  personalInformation: FormInputs | null;
  ladaSelected?: LadaType;
  handleSelectLada: (lada: LadaType) => void;
  handlePersonalInformation: (data: FormInputs) => void;
};

export type FormInputs = {
  firstName: string;
  lastName: string;
  lada?: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const FormRegister = ({
  personalInformation,
  handlePersonalInformation,
  ladaSelected,
  handleSelectLada,
}: PropsFormRegister) => {
  console.log("🚀 ~ personalInformation:", personalInformation);
  const [hiddenPass, setHiddenPass] = useState(true);
  const [hiddenConfirmPass, setHiddenConfirmPass] = useState(true);
  const [openLadaModal, setOpenLadaModal] = useState(false);
  const [showErrorLada, setShowErrorLada] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { data: catalogLada = [] } = useQuery({
    queryKey: [REACT_QUERY_KEYS.lada.getFilterData("registry")],
    queryFn: () => apiLada.getFilterData(),
    ...{
      select: (data: ResponseApi) => data.data.items,
    },
  });

  useEffect(() => {
    if (personalInformation !== null) {
      setValue("firstName", personalInformation.firstName);
      setValue("lastName", personalInformation.lastName);
      setValue("phone", personalInformation.phone);
      setValue("email", personalInformation.email);
      setValue("password", personalInformation.password);
      setValue("confirmPassword", personalInformation.confirmPassword);
    }
  }, [personalInformation]);

  const handleSavePersonalData = async (data: FormInputs) => {
    try {
      const searchUser: ResponseApi = await apiUser.findDuplicateUser(
        data.email,
        data.phone
      );

      if (!ladaSelected?.lada) return setShowErrorLada(true);

      if (searchUser.data.error) {
        ErrorAlertMessage({ message: searchUser.data.message });
      } else {
        handlePersonalInformation({ ...data, lada: ladaSelected?.lada });
      }
    } catch (err) {
      ErrorAlertMessage({});
      // console.log(err);
    }
  };

  const handleOnSelectLada = (data: LadaType) => {
    handleSelectLada(data);
    setShowErrorLada(false);
    setOpenLadaModal(false);
  };

  return (
    <ContentKeyboardAutoScroll>
      <View style={localStyles.ContentForm}>
        <View>
          <ThemedText style={TextStyle.titleRegister}>
            Ingrese sus datos
          </ThemedText>
        </View>
        <View style={localStyles.contentInput}>
          <Text style={localStyles.label}>* Nombre(s)</Text>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={localStyles.input}
                placeholder="Ingrese su nombre"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.firstName && (
            <Text style={TextStyle.textError}>{errors.firstName.message}</Text>
          )}
        </View>
        <View style={localStyles.contentInput}>
          <Text style={localStyles.label}>* Apellido(s)</Text>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={localStyles.input}
                placeholder="Ingrese su apellido"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.lastName && (
            <Text style={TextStyle.textError}>{errors.lastName.message}</Text>
          )}
        </View>
        <View style={localStyles.contentInput}>
          <Text style={localStyles.label}>* Numero de telefono</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              style={localStyles.contentLada}
              onPress={() => setOpenLadaModal((v) => !v)}
            >
              <ThemedText
                style={
                  !ladaSelected
                    ? localStyles.textLadaPlaceholder
                    : localStyles.textLada
                }
              >
                {!ladaSelected
                  ? "Seleccione Lada"
                  : `${ladaSelected.lada} ${ladaSelected.code}`}
              </ThemedText>
            </Pressable>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={{ ...localStyles.input, width: "60%" }}
                  placeholder="Ingrese su numero de telefono"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  maxLength={13}
                />
              )}
            />
          </View>
          {showErrorLada && (
            <Text style={TextStyle.textError}>La lada es requerida</Text>
          )}
          {errors.phone && (
            <Text style={TextStyle.textError}>{errors.phone.message}</Text>
          )}
        </View>
        <View style={localStyles.contentInput}>
          <Text style={localStyles.label}>* Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={localStyles.input}
                placeholder="Ingrese su email"
                keyboardType="email-address"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text style={TextStyle.textError}>{errors.email.message}</Text>
          )}
        </View>
        <View style={localStyles.contentInput}>
          <Text style={localStyles.label}>* Contraseña</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={localStyles.input}>
                <TextInput
                  style={{ width: "80%" }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry={hiddenPass}
                  placeholder="Ingrese su contraseña"
                />
                <TouchableOpacity
                  style={localStyles.icon}
                  onPress={() => setHiddenPass((prev) => !prev)}
                >
                  <Ionicons
                    name={hiddenPass ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && (
            <Text style={TextStyle.textError}>{errors.password.message}</Text>
          )}
        </View>
        <View style={localStyles.contentInput}>
          <Text style={localStyles.label}>* Confirmar Contraseña</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={localStyles.input}>
                <TextInput
                  style={{ width: "80%" }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry={hiddenConfirmPass}
                  placeholder="Ingrese nuevamente su contraseña"
                />
                <TouchableOpacity
                  style={localStyles.icon}
                  onPress={() => setHiddenConfirmPass((prev) => !prev)}
                >
                  <Ionicons
                    name={hiddenConfirmPass ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.confirmPassword && (
            <Text style={TextStyle.textError}>
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>
        <View style={localStyles.contentButton}>
          <GeneralButton
            textBtn="Confirmar datos"
            styleText={TextStyle.fontBoldWhite}
            styleBtn={ButtonGeneralStyle.btnSaveSthetic}
            handleOnPress={handleSubmit(handleSavePersonalData)}
          />
        </View>
      </View>
      <LadaOptionModal
        open={openLadaModal}
        handleCloseModal={() => setOpenLadaModal((v) => !v)}
        listLada={catalogLada}
        handleSelect={handleOnSelectLada}
      />
    </ContentKeyboardAutoScroll>
  );
};

const localStyles = StyleSheet.create({
  ContentForm: {
    alignItems: "center",
  },
  contentInput: {
    justifyContent: "center",
    width: "80%",
    height: 70,
    marginBottom: 10,
  },
  label: {
    ...TextStyle.label,
    marginBottom: 10,
  },
  input: {
    ...TextStyle.value,
    borderWidth: 1,
    borderColor: ThemeColorsSthetic.muted,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    textAlignVertical: "center", // Android
    paddingVertical: Platform.OS === PLATFORM_TYPE.IOS ? 10 : 0,
  },
  contentLada: {
    ...TextStyle.textNote,
    width: "35%",
    height: 40,
    borderWidth: 1,
    borderColor: ThemeColorsSthetic.muted,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  textLadaPlaceholder: {
    ...TextStyle.textNote,
    height: 40,
    lineHeight: Platform.OS === PLATFORM_TYPE.ANDROID ? 50 : 40,
  },
  textLada: {
    ...TextStyle.value,
    height: 40,
    lineHeight: Platform.OS === PLATFORM_TYPE.ANDROID ? 50 : 40,
  },
  inputSelect: {
    marginLeft: 10,
    position: "absolute",
    right: 10,
    marginTop: 6,
  },
  icon: {
    marginLeft: 10,
    position: "absolute",
    right: 10,
    marginTop: 6,
  },
  contentButton: {
    marginVertical: 15,
    width: "80%",
  },
});

export default FormRegister;
