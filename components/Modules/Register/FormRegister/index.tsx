import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import ContentKeyboardAutoScroll from "@/components/Shared/ContentKeyboardAutoScroll";
import { GlobalColors, textColors } from "@/constants/Colors";
import { REGEX } from "@/constants/Constants";
import { ButtonStyle } from "@/constants/StyleComponents";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { apiLada } from "@/api/Lada";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as yup from "yup";
import { apiUser } from "@/api/User";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("Campo obligatorio")
    .matches(REGEX.ONLY_TEXT, "Solo puede agregar letras"),
  lastName: yup
    .string()
    .required("Campo obligatorio")
    .matches(REGEX.ONLY_TEXT, "Solo puede agregar letras"),
  lada: yup
    .string()
    .required("La lada es obligatoria")
    .notOneOf(["0"], "La lada es obligatoria"),
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
  handlePersonalInformation: (data: FormInputs) => void;
};

export type FormInputs = {
  firstName: string;
  lastName: string;
  lada: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const FormRegister = ({
  personalInformation,
  handlePersonalInformation,
}: PropsFormRegister) => {
  const [hiddenPass, setHiddenPass] = useState(true);
  const [hiddenConfirmPass, setHiddenConfirmPass] = useState(true);

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
      lada: "",
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
      select: (data: ResponseAPi) => data.data.items,
    },
  });

  useEffect(() => {
    if (personalInformation !== null) {
      setValue("firstName", personalInformation.firstName);
      setValue("lastName", personalInformation.lastName);
      setValue("lada", personalInformation.lada);
      setValue("phone", personalInformation.phone);
      setValue("email", personalInformation.email);
      setValue("password", personalInformation.password);
      setValue("confirmPassword", personalInformation.confirmPassword);
    }
  }, [personalInformation]);

  const handleSavePersonalData = async (data: FormInputs) => {
    try {
      const searchUser: ResponseAPi = await apiUser.findDuplicateUser(
        data.email,
        data.phone
      );

      if (searchUser.data.error) {
        ErrorAlertMessage(searchUser.data.message);
      } else {
        handlePersonalInformation(data);
      }
    } catch (err) {
      ErrorAlertMessage();
      // console.log(err);
    }
  };

  return (
    <ContentKeyboardAutoScroll>
      <View style={localStyles.ContentForm}>
        <View style={localStyles.contentInput}>
          <Text style={localStyles.label}>Nombre(s)</Text>
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
            <Text style={textColors.errors}>{errors.firstName.message}</Text>
          )}
        </View>
        <View style={localStyles.contentInput}>
          <Text style={localStyles.label}>Apellido(s)</Text>
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
            <Text style={textColors.errors}>{errors.lastName.message}</Text>
          )}
        </View>
        <View style={localStyles.contentInput}>
          <Text style={localStyles.label}>Numero de telefono</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: "65%",
            }}
          >
            <Controller
              control={control}
              name="lada"
              render={({ field: { onChange, value } }) => (
                <View
                  style={{
                    ...localStyles.inputSelect,
                    width: "35%",
                  }}
                >
                  <Picker
                    style={{
                      marginTop: 0,
                      marginBottom: 0,
                      marginHorizontal: -10,
                    }}
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                    itemStyle={{ padding: 0, width: 50 }}
                  >
                    <Picker.Item label="Seleccione una opcion" value="0" />
                    {catalogLada?.map((item: any) => (
                      <Picker.Item
                        key={item?.id}
                        label={item?.lada}
                        value={item?.id}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            />
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
          {errors.lada && (
            <Text style={textColors.errors}>{errors.lada.message}</Text>
          )}
          {errors.phone && (
            <Text style={textColors.errors}>{errors.phone.message}</Text>
          )}
        </View>
        <View style={localStyles.contentInput}>
          <Text style={localStyles.label}>Email</Text>
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
            <Text style={textColors.errors}>{errors.email.message}</Text>
          )}
        </View>
        <View style={localStyles.contentInput}>
          <Text style={localStyles.label}>Contraseña</Text>
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
            <Text style={textColors.errors}>{errors.password.message}</Text>
          )}
        </View>
        <View style={localStyles.contentInput}>
          <Text style={localStyles.label}>Confirmar Contraseña</Text>
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
            <Text style={textColors.errors}>
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>
        <View style={localStyles.contentButton}>
          <Button
            title="Confirmar datos"
            color={ButtonStyle.btnSuccess.color}
            onPress={handleSubmit(handleSavePersonalData)}
          />
        </View>
      </View>
    </ContentKeyboardAutoScroll>
  );
};

const localStyles = StyleSheet.create({
  ContentForm: {
    alignItems: "center",
    // marginTop: 30,
    // height: "100%",
  },
  contentInput: {
    justifyContent: "center",
    width: "80%",
    height: 70,
    marginBottom: 10,
  },
  label: {
    color: GlobalColors.pinkColor,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputSelect: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  icon: {
    marginLeft: 10,
  },
  contentButton: {
    marginTop: 15,
    width: "80%",
  },
});

export default FormRegister;
