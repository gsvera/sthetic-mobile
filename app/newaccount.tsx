import React from "react";
import Plan from "@/components/Modules/Register/Plan";
import { ThemedText } from "@/components/ThemedText";
import { Container, ThemeColorsSthetic } from "@/constants/Colors";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import FormRegister, {
  FormInputs,
} from "@/components/Modules/Register/FormRegister";
import { PlanCardProps } from "@/components/Modules/Register/Plan/PlanCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiUser } from "@/api/User";
import PoliticsAndConditions from "@/components/Modules/Register/PoliticsAndConditions";
import SuccessNotificationView from "@/components/Shared/Notifications/SuccessNotification";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { KEY_STORE, setStoreSession } from "@/hooks/StoreDataSecure";
import { useApiProvider } from "@/provider/InterceptorProvider";
import { parsePasswordEncrypt } from "@/utils/GeneralUtils";
import ArrowBack from "@/components/Modules/Register/ArrowBack";
import FormPay from "@/components/Modules/Register/FormPay";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { LadaType } from "@/constants/GeneralTypes";
import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";

enum STEP_CREATION_PROFILE {
  FIELD_PROFILE = 1,
  SELECT_PLAN = 2,
  AGREE_CONDITIONS = 3,
  FORM_PAY = 4,
}

export default function newAccount() {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { setToken } = useApiProvider();
  const [agreeConditions, setAgreeConditions] = useState(false);
  const [showMessageSucces, setShowMessageSuccess] = useState(false);
  const [planSelected, setPlanSelected] = useState<PlanCardProps | null>(null);
  const [totalToPay, setTotalToPay] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [stepView, setStepView] = useState(STEP_CREATION_PROFILE.FIELD_PROFILE);
  const [personalInformation, setPersonalInformation] =
    useState<FormInputs | null>(null);
  const [ladaSelected, setLadaSelected] = useState<LadaType>();

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
    onSuccess: (data: ResponseApi) => handleSuccessSaveUser(data?.data),
    onError: (err) => ErrorAlertMessage,
  });

  const handleSuccessSaveUser = (data: ObjectResponse) => {
    if (data.error) {
      ErrorAlertMessage({ message: data.message });
      return;
    }
    setShowMessageSuccess(true);
    setTimeout(() => {
      setStoreSession({ key: KEY_STORE.userToken, value: data.items.token });
      setStoreSession({ key: KEY_STORE.idUser, value: data.items.idUser });
      setToken(data.items.token);
    }, 3000);
    setStepView(STEP_CREATION_PROFILE.FIELD_PROFILE);
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
    setStepView(STEP_CREATION_PROFILE.FORM_PAY);
    setCoupon("");
    queryClient.removeQueries({
      queryKey: [REACT_QUERY_KEYS.catalogs.coupon.getByCode("get-coupon")],
    });
  };

  function payPlan() {
    if (totalToPay === 0) {
      // EL ID PROFILE 2 ES PARA LOS QUE PRESENTAN SERVICIOS
      createUser({
        ...personalInformation,
        password: parsePasswordEncrypt(personalInformation?.password as string),
        planSelect: planSelected?.id,
        idProfile: 2,
        paymentPlanDTO: {
          planId: planSelected?.id,
          amountPaid: totalToPay,
          paymentMethod: "free",
          codeCoupon: coupon,
        },
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
    setLadaSelected(undefined);
    navigation.navigate("login" as never);
  };

  return (
    <View
      style={{
        ...Container.container,
        backgroundColor: ThemeColorsSthetic.backgroundStrong,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {showMessageSucces ? (
        <SuccessNotificationView message="Su cuenta ha sido creada con exito" />
      ) : (
        <View
          style={{
            backgroundColor: ThemeColorsSthetic.backgroundLight,
            height: "100%",
          }}
        >
          <View>
            <ButtonCloseModal handleOnPress={handleCancel} />
          </View>
          <ThemedText style={localStyles.title}>Crear cuenta nueva</ThemedText>
          {stepView === STEP_CREATION_PROFILE.FIELD_PROFILE && (
            <FormRegister
              handlePersonalInformation={handlePersonalInformationStore}
              personalInformation={personalInformation}
              ladaSelected={ladaSelected}
              handleSelectLada={setLadaSelected}
            />
          )}
          {stepView === STEP_CREATION_PROFILE.AGREE_CONDITIONS && (
            <>
              <ArrowBack
                view={STEP_CREATION_PROFILE.FIELD_PROFILE}
                handleReturn={setStepView}
              />
              <PoliticsAndConditions
                handleAgreeTerms={handleAgreeConditions}
                stateCheck={agreeConditions}
              />
            </>
          )}
          {stepView === STEP_CREATION_PROFILE.SELECT_PLAN && (
            <>
              <ArrowBack
                view={STEP_CREATION_PROFILE.AGREE_CONDITIONS}
                handleReturn={setStepView}
              />
              <Plan selectedPlan={handleSelectedPlan} />
            </>
          )}
          {stepView === STEP_CREATION_PROFILE.FORM_PAY && (
            <>
              <ArrowBack
                view={STEP_CREATION_PROFILE.SELECT_PLAN}
                handleReturn={setStepView}
              />
              <FormPay
                plan={planSelected}
                totalToPay={totalToPay}
                coupon={coupon}
                changeTotalToPay={setTotalToPay}
                changeCoupon={setCoupon}
                handlePay={payPlan}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
    height: 50,
    paddingTop: 10,
    color: ThemeColorsSthetic.textTitle,
  },
});
