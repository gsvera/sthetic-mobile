import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { functionServicesType } from "../types";
import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { ThemedText } from "@/components/ThemedText";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import apiUserConfig from "@/api/UserConfig";
import { StripeDataCustomerType, UserPlan } from "@/constants/GeneralTypes";
import {
  convertCurrency,
  convertDateToGeneralFormat,
} from "@/utils/GeneralUtils";
import { ThemeColorsSthetic } from "@/constants/Colors";
import GeneralButton from "@/components/Shared/GeneralButton";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { useMemo, useState } from "react";
import StripePayment from "@/components/Shared/StripePayment";
import {
  PAYMENT_TYPE,
  STATUS_ACCOUNT_PAY,
  TYPE_STATUS,
} from "@/constants/Constants";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { apiUser } from "@/api/User";
import dayjs from "dayjs";

type mySupscriptionProps = functionServicesType & {
  nameCustomer: string;
  emailCustomer: string;
};

export const MySupscription = ({
  idUser,
  nameCustomer,
  emailCustomer,
  returnBack,
}: mySupscriptionProps) => {
  const queryClient = useQueryClient();
  const { handleNotification } = useNotificationProvider();
  const [openModalPayment, setOpenModalPayment] = useState(false);

  const { data: planData } = useQuery({
    queryKey: [REACT_QUERY_KEYS.plan.getByUser(idUser as string)],
    queryFn: () => apiUserConfig.getPlanByUser(idUser),
    ...{
      select: (data: ResponseApi) => data.data.items as UserPlan,
    },
  });

  const { mutate: savePaySstripe } = useMutation({
    mutationFn: (data: any) => apiUser.savePayStripe(data),
    onSuccess: (data: ResponseApi) => handleSuccessSavePayStripe(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessSavePayStripe = (data: ObjectResponse) => {
    if (data.error)
      return handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });
    handleNotification({ type: TYPE_STATUS.SUCCESS, message: data.message });
    setOpenModalPayment(false);
  };

  const objPay = useMemo(
    () => ({
      nameProduct: planData?.catalogPlanDTO.name ?? "",
      amount: planData?.catalogPlanDTO.price ?? 0,
      nameCustomer,
      emailCustomer,
    }),
    [planData, idUser]
  );

  const handleClosePay = () => {
    setOpenModalPayment(false);
    queryClient.invalidateQueries({
      queryKey: [REACT_QUERY_KEYS.plan.getByUser(idUser as string)],
    });
  };

  const handleSuccessPay = (data: StripeDataCustomerType) => {
    savePaySstripe({
      ...data,
      idUser: idUser,
      planId: planData?.catalogPlanDTO.id,
      amountPaid: objPay.amount,
      paymentDate: dayjs().toISOString(),
      paymentMethod: PAYMENT_TYPE.STRIPE,
    });
  };

  return (
    <View>
      <SubHeaderReturn subtitle="Mi subscripción" handleReturn={returnBack} />
      <View
        style={{
          paddingHorizontal: 15,
          paddingTop: 20,
        }}
      >
        <View style={localStyle.contentTitlePlan}>
          <View>
            <ThemedText style={localStyle.textLabelTitle}>Plan</ThemedText>
            <Text style={localStyle.titlePlan}>
              {planData?.catalogPlanDTO.name}
            </Text>
          </View>
        </View>

        <View style={localStyle.rowData}>
          <View>
            <ThemedText style={localStyle.textLabel}>Fecha Inicio:</ThemedText>
          </View>
          <View>
            <ThemedText style={localStyle.textValue}>
              {convertDateToGeneralFormat(planData?.startDate)}
            </ThemedText>
          </View>
        </View>
        <View style={localStyle.rowData}>
          <View>
            <ThemedText style={localStyle.textLabel}>Fecha Fin:</ThemedText>
          </View>
          <View>
            <ThemedText style={localStyle.textValue}>
              {convertDateToGeneralFormat(planData?.endDate)}
            </ThemedText>
          </View>
        </View>
        <View style={localStyle.rowData}>
          <View>
            <ThemedText style={localStyle.textLabel}>Estatus:</ThemedText>
          </View>
          <View>
            {planData?.isActive ? (
              <View style={localStyle.badgeActive}>
                <ThemedText
                  style={{ ...TextStyle.fontBoldWhite, ...TextStyle.center }}
                >
                  {STATUS_ACCOUNT_PAY.CURRENT_ACCOUNT}
                </ThemedText>
              </View>
            ) : (
              <View style={localStyle.badgeInactive}>
                <ThemedText
                  style={{ ...TextStyle.fontBoldWhite, ...TextStyle.center }}
                >
                  {STATUS_ACCOUNT_PAY.OVERDUE_ACCOUNT}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
        <View style={localStyle.rowData}>
          <View>
            <ThemedText style={localStyle.textLabel}>Costo:</ThemedText>
          </View>
          <View>
            <ThemedText style={localStyle.textValue}>
              {convertCurrency(planData?.catalogPlanDTO.price)}
            </ThemedText>
          </View>
        </View>
        <View style={localStyle.contentBtn}>
          <GeneralButton
            textBtn="Pagar ahora"
            styleText={TextStyle.fontBoldWhite}
            styleBtn={localStyle.btnPay}
            handleOnPress={() => setOpenModalPayment(true)}
          />
        </View>
      </View>
      {openModalPayment && (
        <StripePayment
          open={openModalPayment}
          handleCancel={handleClosePay}
          objPay={objPay}
          handleSuccesPayment={handleSuccessPay}
        />
      )}
    </View>
  );
};

const localStyle = StyleSheet.create({
  rowData: {
    ...GridStyle.rowSpaceBetween,
    marginVertical: 10,
  },
  contentTitlePlan: {
    height: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  titlePlan: {
    ...TextStyle.center,
    ...TextStyle.bold,
    ...TextStyle.size40,
    color: ThemeColorsSthetic.textOre,
  },
  textLabelTitle: {
    ...TextStyle.center,
    ...TextStyle.size20,
    color: ThemeColorsSthetic.textTitle,
  },
  textLabel: {
    ...TextStyle.size20,
    ...TextStyle.label,
  },
  textValue: {
    ...TextStyle.value,
  },
  contentBtn: {
    width: "80%",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
    marginHorizontal: "auto",
  },
  btnPay: {
    ...ButtonGeneralStyle.btnSaveSthetic,
    width: "80%",
  },
  badgeActive: {
    backgroundColor: ThemeColorsSthetic.accent,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: "center",
  },
  badgeInactive: {
    backgroundColor: ThemeColorsSthetic.accentReverse,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: "center",
  },
});

export default MySupscription;
