import { apiLada } from "@/api/Lada";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { apiUser } from "@/api/User";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { SubHeaderReturn } from "@/components/Shared/SubHeaderReturn";
import { ThemedText } from "@/components/ThemedText";
import { GlobalColors, textColors } from "@/constants/Colors";
import { REGEX, TYPE_STATUS } from "@/constants/Constants";
import { ButtonStyle, GeneralStyle } from "@/constants/StyleComponents";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TextInput,
  Text,
  Button,
} from "react-native";
import * as yup from "yup";

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
    .required("Campo obligatorio")
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
});

export type formPersonalInformation = {
  firstName: string;
  lastName: string;
  lada: string;
  email: string;
  phone: string;
};

type subModuleProps = {
  formDataInformation: formPersonalInformation;
  returnBack: () => void;
};

export const PersonalInformation = ({
  formDataInformation,
  returnBack,
}: subModuleProps) => {
  const { handleNotification } = useNotificationProvider();
  const [disableButton, setDisableButton] = useState(true);
  const queryClient = useQueryClient();
  const initFormData = formDataInformation;
  const [lada, setLada] = useState(); // DEBE ESTAS CON EL useform PERO POR EL MOMENTO NO SE VA A EDITAR
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<formPersonalInformation>({
    resolver: yupResolver(schema),
    defaultValues: formDataInformation,
  });
  const formData = watch();

  const { data: dataLada = [] } = useQuery({
    queryKey: [REACT_QUERY_KEYS.lada.getFilterData("personal-information")],
    queryFn: () => apiLada.getFilterData(),
    ...{
      select: (data: ResponseAPi) => data.data.items,
    },
  });

  const { mutate: updatePersonalInformation } = useMutation({
    mutationFn: (data: formPersonalInformation) =>
      apiUser.updatePersonalInformation(data),
    onSuccess: (data: ResponseAPi) => handleSuccessUpdate(data),
    onError: (err) => handleErrorUpdate(err),
  });

  const handleSuccessUpdate = (data: ResponseAPi) => {
    if (data.data.error) {
      handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.data.message,
      });
      return;
    }
    queryClient.invalidateQueries({
      queryKey: [REACT_QUERY_KEYS.user.getDataUser("personal-information")],
    });
    handleNotification({
      type: TYPE_STATUS.SUCCESS,
      message: "Sus datos se han actualizado con éxito",
    });
    returnBack();
  };

  const handleErrorUpdate = (err: any) => {
    // console.log("🚀 ~ handleErrorUpdate ~ err:", err);
    ErrorAlertMessage();
  };

  // EFFECTS
  useEffect(() => {
    if (dataLada && initFormData.lada) {
      const findLada = dataLada?.find(
        (item: any) => item?.id == initFormData.lada
      );
      setLada(findLada?.lada);
    }
  }, [initFormData.lada, dataLada]);

  useEffect(() => {
    const hasFormDataChange =
      JSON.stringify(initFormData) === JSON.stringify(formData);
    setDisableButton(hasFormDataChange);
  }, [initFormData, formData]);

  const handleUpdatePersonalInformation = async (
    data: formPersonalInformation
  ) => {
    try {
      updatePersonalInformation(data);
    } catch (err) {
      // console.log(err);
      ErrorAlertMessage();
    }
  };

  return (
    <View>
      <SubHeaderReturn
        subtitle="Mis datos personales"
        handleReturn={returnBack}
      />
      {/* {loadingData ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : ( */}
      <View style={{ justifyContent: "center", flexDirection: "row" }}>
        <View style={{ width: "80%", paddingTop: 20 }}>
          <View style={{ marginVertical: 10 }}>
            <ThemedText style={localStyle.label}>Nombre(s)</ThemedText>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={GeneralStyle.simpleInput}
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
          <View style={{ marginVertical: 10 }}>
            <ThemedText style={localStyle.label}>Apellido(s)</ThemedText>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={GeneralStyle.simpleInput}
                  placeholder="Ingrese su apellido"
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
          <View style={{ marginVertical: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "35%" }}>
                <ThemedText style={localStyle.label}>Lada</ThemedText>
                {/* <Controller
                    control={control}
                    name="lada"
                    render={({ field: { value } }) => ( */}
                <TextInput
                  style={GeneralStyle.simpleInput}
                  value={lada}
                  editable={false}
                  selectTextOnFocus={false}
                />
                {/* )}
                  /> */}
              </View>
              <View style={{ width: "60%" }}>
                <ThemedText style={localStyle.label}>Telefono</ThemedText>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={GeneralStyle.simpleInput}
                      placeholder="Ingrese su numero de telefono"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      maxLength={13}
                    />
                  )}
                />
                {errors.phone && (
                  <Text style={textColors.errors}>{errors.phone.message}</Text>
                )}
              </View>
            </View>
          </View>
          <View style={{ marginVertical: 10 }}>
            <ThemedText style={localStyle.label}>Email</ThemedText>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={GeneralStyle.simpleInput}
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
          <View style={localStyle.contentButton}>
            <Button
              title="Actualizar datos"
              color={
                !disableButton
                  ? ButtonStyle.btnSuccess.color
                  : ButtonStyle.btnDisabled.color
              }
              onPress={handleSubmit(handleUpdatePersonalInformation)}
              disabled={disableButton}
            />
          </View>
        </View>
      </View>
      {/* )} */}
    </View>
  );
};

const localStyle = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalColors.blackColor,
    marginBottom: 10,
  },
  contentButton: {
    marginTop: 15,
  },
});

export default PersonalInformation;
