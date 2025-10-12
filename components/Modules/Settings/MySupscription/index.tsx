import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { functionServicesType } from "../types";
import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { ThemedText } from "@/components/ThemedText";
import {
  ButtonGeneralStyle,
  GridStyle,
  InputStyle,
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
import { useEffect, useMemo, useState } from "react";
import StripePayment from "@/components/Shared/StripePayment";
import {
  PAYMENT_TYPE,
  PLATFORM_TYPE,
  STATUS_ACCOUNT_PAY,
  TYPE_STATUS,
} from "@/constants/Constants";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { apiUser } from "@/api/User";
import dayjs from "dayjs";
import { apiCoupon } from "@/api/Coupon";
import ContentKeyboardAutoScroll from "@/components/Shared/ContentKeyboardAutoScroll";
import LoadingView from "@/components/Shared/LoadingView";
import HistoryPayModal from "./HistoryPayModal";

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
  const [shouldFetch, setShouldFetch] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [totalPay, setTotalPay] = useState(0);
  const [openHistoryPayModal, setOpenHistoryPayModal] = useState(false);

  const { data: planData } = useQuery({
    queryKey: [REACT_QUERY_KEYS.plan.getByUser(idUser as string)],
    queryFn: () => apiUserConfig.getPlanByUser(idUser),
    ...{
      select: (data: ResponseApi) => data.data.items as UserPlan,
    },
  });

  const { data: couponData, isFetching: isFetchingCoupon } = useQuery({
    queryKey: [
      REACT_QUERY_KEYS.catalogs.coupon.getByCode("get-coupon-renew-pay"),
    ],
    queryFn: () => apiCoupon.getCoupon({ code: coupon as string, idUser }),
    ...{
      enabled: shouldFetch,
      select: (data: ResponseApi) => data.data,
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
    setCoupon("");
    handleNotification({ type: TYPE_STATUS.SUCCESS, message: data.message });
    setOpenModalPayment(false);
    queryClient.invalidateQueries({
      queryKey: [REACT_QUERY_KEYS.plan.getByUser(idUser as string)],
    });
  };

  useEffect(() => {
    if (planData?.catalogPlanDTO.price) {
      if (
        couponData !== undefined &&
        !couponData?.error &&
        planData?.catalogPlanDTO.price
      ) {
        setTotalPay(
          planData?.catalogPlanDTO.price - couponData?.items.discountAmount
        );
        setDiscount(couponData?.items.discountAmount);
      } else {
        setTotalPay(planData?.catalogPlanDTO.price ?? 0);
        setDiscount(0);
      }
    }
  }, [planData, couponData]);

  const objPay = useMemo(
    () => ({
      nameProduct: planData?.catalogPlanDTO.name ?? "",
      amount: totalPay,
      nameCustomer,
      emailCustomer,
    }),
    [planData, idUser, totalPay]
  );

  useEffect(() => {
    if (coupon === null || coupon === undefined || coupon === "") {
      queryClient.setQueryData(
        [REACT_QUERY_KEYS.catalogs.coupon.getByCode("get-coupon-renew-pay")],
        null
      );
      setTotalPay(planData?.catalogPlanDTO.price ?? 0);
      setDiscount(0);
    }
    const handler = setTimeout(() => {
      if (coupon) setShouldFetch(true);
    }, 1000);
    return () => {
      clearTimeout(handler);
      setShouldFetch(false);
    };
  }, [coupon]);

  const handleClosePay = () => {
    setOpenModalPayment(false);
    queryClient.invalidateQueries({
      queryKey: [REACT_QUERY_KEYS.plan.getByUser(idUser as string)],
    });
  };

  const handleSuccessPay = (data: StripeDataCustomerType | null) => {
    savePaySstripe({
      ...data,
      idUser: idUser,
      planId: planData?.catalogPlanDTO.id,
      amountPaid: objPay.amount,
      paymentDate: dayjs().toISOString(),
      paymentMethod: totalPay === 0 ? PAYMENT_TYPE.FREE : PAYMENT_TYPE.STRIPE,
      codeCoupon: coupon,
    });
  };

  const handlePayment = () => {
    if (totalPay === 0) {
      handleSuccessPay(null);
    } else {
      setOpenModalPayment(true);
    }
  };

  return (
    <View>
      <SubHeaderReturn subtitle="Mi subscripción" handleReturn={returnBack} />
      <ContentKeyboardAutoScroll>
        <View
          style={{
            paddingHorizontal: 15,
          }}
        >
          <View style={localStyle.contentTitlePlan}>
            <View>
              <ThemedText style={localStyle.textLabelTitle}>Plan</ThemedText>
              <ThemedText style={localStyle.titlePlan}>
                {planData?.catalogPlanDTO.name}
              </ThemedText>
              <View style={GridStyle.rowContentCenter}>
                <TouchableOpacity onPress={() => setOpenHistoryPayModal(true)}>
                  <ThemedText style={localStyle.textHistory}>
                    Historial de pagos
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={localStyle.rowData}>
            <View>
              <ThemedText style={localStyle.textLabel}>
                Fecha Inicio:
              </ThemedText>
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
          <View style={localStyle.rowData}>
            <ThemedText style={TextStyle.label}>¿Tiene un cupon?</ThemedText>
            <TextInput
              style={localStyle.inputCoupon}
              onChangeText={setCoupon}
              value={coupon}
            />
          </View>
          {isFetchingCoupon ? (
            <LoadingView styleProps={localStyle.loader} />
          ) : coupon && couponData ? (
            <View style={localStyle.rowData}>
              <View>
                <ThemedText style={TextStyle.label}>Descuento de:</ThemedText>
                {couponData.error && (
                  <ThemedText style={TextStyle.redColor}>
                    {couponData.message}
                  </ThemedText>
                )}
              </View>
              <ThemedText style={TextStyle.value}>
                {couponData?.items?.discountAmount && convertCurrency(discount)}
              </ThemedText>
            </View>
          ) : (
            <></>
          )}
          <View style={localStyle.rowData}>
            <View>
              <ThemedText style={TextStyle.label}>Total a pagar:</ThemedText>
            </View>
            <View>
              <ThemedText style={TextStyle.value}>
                {totalPay && convertCurrency(totalPay)}
              </ThemedText>
            </View>
          </View>
          <View style={localStyle.contentBtn}>
            <GeneralButton
              textBtn="Pagar ahora"
              styleText={TextStyle.fontBoldWhite}
              styleBtn={localStyle.btnPay}
              handleOnPress={handlePayment}
            />
          </View>
        </View>
      </ContentKeyboardAutoScroll>
      {openModalPayment && (
        <StripePayment
          open={openModalPayment}
          handleCancel={handleClosePay}
          objPay={objPay}
          handleSuccesPayment={handleSuccessPay}
        />
      )}
      {openHistoryPayModal && (
        <HistoryPayModal
          open={openHistoryPayModal}
          handleCloseModal={() => setOpenHistoryPayModal(false)}
          idUser={idUser}
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
    paddingVertical: Platform.OS === PLATFORM_TYPE.ANDROID ? 10 : 15,
    marginBottom: Platform.OS === PLATFORM_TYPE.ANDROID ? 10 : 0,
  },
  textHistory: {
    ...TextStyle.textNote,
    textDecorationLine: "underline",
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
  inputCoupon: {
    ...InputStyle.withBorder,
    ...TextStyle.value,
    padding: 5,
    fontSize: 18,
    width: 100,
  },
  loader: {
    marginTop: 10,
    height: 40,
  },
});

export default MySupscription;
