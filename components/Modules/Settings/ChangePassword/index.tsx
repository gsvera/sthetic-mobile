import { apiUser } from "@/api/User";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { ThemedText } from "@/components/ThemedText";
import { GlobalColors } from "@/constants/Colors";
import { REGEX, TYPE_STATUS } from "@/constants/Constants";
import { ButtonStyle, GeneralStyle } from "@/constants/StyleComponents";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type changePasswordProps = {
  returnBack: () => void;
};

export const ChangePassword = ({ returnBack }: changePasswordProps) => {
  const { handleNotification } = useNotificationProvider();
  const [hiddenPass, setHiddenPass] = useState(true);
  const [enableBtn, setEnableBtn] = useState(false);
  const [valuePass, setValuePass] = useState("");

  const { mutate: updatePassword } = useMutation({
    mutationFn: (value: string) => apiUser.updatePassword(value),
    onSuccess: (data: ResponseAPi) => handleResponseUpdate(data),
    onError: (err) => handleErrorUpdate(err),
  });

  const handleResponseUpdate = (data: ResponseAPi) => {
    if (data?.data?.error) {
      handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.data.message,
      });
      return;
    }
    handleNotification({
      type: TYPE_STATUS.UPDATE,
      message: data.data.message,
    });
    returnBack();
  };

  const handleErrorUpdate = (err: any) => {
    ErrorAlertMessage();
  };

  useEffect(() => {
    if (REGEX.PASSWORD.test(valuePass)) setEnableBtn(false);
    else setEnableBtn(true);
  }, [valuePass]);

  const handleOnChangePassword = (value: string) => {
    setValuePass(value);
  };

  const handleSubmitUpdate = () => {
    updatePassword(valuePass);
  };

  return (
    <View>
      <SubHeaderReturn
        subtitle="Cambiar de contraseña"
        handleReturn={returnBack}
      />
      <View style={localStyle.contentSingleInput}>
        <ThemedText style={localStyle.label}>
          Ingrese su nueva contraseña
        </ThemedText>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={{ ...GeneralStyle.simpleInput, width: "100%" }}
            secureTextEntry={hiddenPass}
            onChangeText={(evt) => handleOnChangePassword(evt)}
          />
          <TouchableOpacity
            style={localStyle.icon}
            onPress={() => setHiddenPass((prev) => !prev)}
          >
            <Ionicons
              name={hiddenPass ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 15 }}>
          <ThemedText style={localStyle.textObservation}>
            Tu contraseña debe tener al menos:
          </ThemedText>
          <ThemedText style={localStyle.textObservation}>
            8 caracteres, (20 máx.)
          </ThemedText>
          <ThemedText style={localStyle.textObservation}>
            1 letra y 1 número
          </ThemedText>
          <ThemedText style={localStyle.textObservation}>
            1 mayúscula
          </ThemedText>
          <ThemedText style={localStyle.textObservation}>
            1 carácter especial
          </ThemedText>
        </View>
        <View style={{ marginTop: 20 }}>
          <Button
            title="Actualizar datos"
            color={
              !enableBtn
                ? ButtonStyle.btnSuccess.color
                : ButtonStyle.btnDisabled.color
            }
            onPress={handleSubmitUpdate}
            disabled={enableBtn}
          />
        </View>
      </View>
    </View>
  );
};

const localStyle = StyleSheet.create({
  contentSingleInput: {
    marginTop: "10%",
    paddingHorizontal: "10%",
  },
  label: {
    color: GlobalColors.blackColor,
    fontWeight: "bold",
  },
  textObservation: {
    color: GlobalColors.grayColor,
    fontSize: 14,
  },
  icon: {
    marginLeft: -30,
  },
});

export default ChangePassword;
