import React from "react";
import Plan from "@/components/Modules/Register/Plan";
import { ThemedText } from "@/components/ThemedText";
import { Container, GlobalColors } from "@/constants/Colors";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Alert, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import FormRegister, {
  FormInputs,
} from "@/components/Modules/Register/FormRegister";
import { PlanCardProps } from "@/components/Modules/Register/Plan/PlanCard";
import { useMutation } from "@tanstack/react-query";
import { apiUser } from "@/api/User";
import PoliticsAndConditions from "@/components/Modules/Register/PoliticsAndConditions";
import SuccessNotification from "@/components/Shared/Notifications/SuccessNotification";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { KEY_STORE, setStoreSession } from "@/hooks/StoreDataSecure";
import { useApiProvider } from "@/provider/InterceptorProvider";

enum STEP_CREATION_PROFILE {
  FIELD_PROFILE = 1,
  SELECT_PLAN = 2,
  AGREE_CONDITIONS = 3,
}

export default function newAccount() {
  const navigation = useNavigation();
  const { setToken } = useApiProvider();
  const [agreeConditions, setAgreeConditions] = useState(false);
  const [showMessageSucces, setShowMessageSuccess] = useState(false);
  const [planSelected, setPlanSelected] = useState<PlanCardProps | null>(null);
  const [stepView, setStepView] = useState(STEP_CREATION_PROFILE.FIELD_PROFILE);
  const [personalInformation, setPersonalInformation] =
    useState<FormInputs | null>(null);

  useEffect(() => navigation.setOptions({ headerShown: false }), [navigation]);

  useEffect(() => {
    if (showMessageSucces) {
      setTimeout(() => {
        setShowMessageSuccess(false);
        navigation.navigate("(tabs)" as never);
      }, 4000);
    }
  }, [showMessageSucces]);

  const { mutate: createUser } = useMutation({
    mutationFn: (data: any) => apiUser.saveUser(data),
    onSuccess: (data: ResponseAPi) => handleSuccessSaveUser(data?.data),
    onError: (err) => handleErrorSaveUser(err),
  });

  const handleSuccessSaveUser = (data: ObjectResponse) => {
    // console.log("🚀 ~ handleSuccessSaveUser ~ data:", data);
    if (data.error) {
      // console.log("🚀 ~ handleSuccessSaveUser ~ data.error:", data.error);
      ErrorAlertMessage();
      return;
    }
    setStoreSession({ key: KEY_STORE.userToken, value: data.items.token });
    setToken(data.items.token);
    setShowMessageSuccess(true);
  };

  const handleErrorSaveUser = (error: any) => {
    // console.log("🚀 ~ handleErrorSaveUser ~ error:", error);
    ErrorAlertMessage();
  };

  const handlePersonalInformationStore = (personalInformation: FormInputs) => {
    setPersonalInformation(personalInformation);
    setStepView(STEP_CREATION_PROFILE.AGREE_CONDITIONS);
  };

  const handleAgreeConditions = (isCheck: boolean) => {
    setAgreeConditions(isCheck);
    if (isCheck) setStepView(STEP_CREATION_PROFILE.SELECT_PLAN);
  };

  const handleSelectedPlan = (plan: PlanCardProps) => {
    setPlanSelected(plan);
    payPlan(plan);
    // console.log("🚀 ~ handleSelectedPlan ~ plan:", plan);
    // console.log("por aqui");
  };

  function payPlan(plan: PlanCardProps) {
    if (plan && plan.price === 0) {
      // EL ID PROFILE 2 ES PARA LOS QUE PRESENTAN SERVICIOS
      createUser({
        ...personalInformation,
        planSelect: plan.id,
        idProfile: 2,
      });
    } else {
      // aqui va la logica para pagar lo mas seguro PAYPAL o MERCADO PAGO hay que validar opciones
    }
  }

  const handleCancel = () => {
    setStepView(STEP_CREATION_PROFILE.FIELD_PROFILE);
    setPersonalInformation(null);
    setPlanSelected(null);
    setAgreeConditions(false);
    // console.log("no");
    navigation.navigate("login" as never);
    // <Redirect href="/login" />;
    // console.log("si");
  };

  return (
    <SafeAreaView style={{ ...Container.container, paddingTop: 10 }}>
      {showMessageSucces ? (
        <SuccessNotification />
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingRight: 20,
            }}
          >
            <AntDesign
              onPress={() => handleCancel()}
              name="close"
              size={24}
              color={GlobalColors.blackColor}
            />
          </View>
          <ThemedText style={localStyles.title}>Crear cuenta nueva</ThemedText>
          {stepView === STEP_CREATION_PROFILE.FIELD_PROFILE && (
            <FormRegister
              handlePersonalInformation={handlePersonalInformationStore}
              personalInformation={personalInformation}
            />
          )}
          {stepView === STEP_CREATION_PROFILE.AGREE_CONDITIONS && (
            <>
              <TouchableOpacity
                style={{ position: "fixed", left: 20, marginBottom: -25 }}
                onPress={() => setStepView(STEP_CREATION_PROFILE.FIELD_PROFILE)}
              >
                <AntDesign
                  name="arrowleft"
                  size={24}
                  color={GlobalColors.blackColor}
                />
              </TouchableOpacity>
              <PoliticsAndConditions
                handleAgreeTerms={handleAgreeConditions}
                stateCheck={agreeConditions}
              />
            </>
          )}
          {stepView === STEP_CREATION_PROFILE.SELECT_PLAN && (
            <>
              <TouchableOpacity
                style={{ position: "fixed", left: 20, marginBottom: -25 }}
                onPress={() =>
                  setStepView(STEP_CREATION_PROFILE.AGREE_CONDITIONS)
                }
              >
                <AntDesign
                  name="arrowleft"
                  size={24}
                  color={GlobalColors.blackColor}
                />
              </TouchableOpacity>
              <Plan selectedPlan={handleSelectedPlan} />
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
    height: 50,
    paddingTop: 10,
    color: GlobalColors.blueColor,
  },
});
