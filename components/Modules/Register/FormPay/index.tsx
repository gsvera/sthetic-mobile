import { StyleSheet, TextInput, View } from "react-native";
import { PlanCardProps } from "../Plan/PlanCard";
import { ThemedText } from "@/components/ThemedText";
import {
  ButtonGeneralStyle,
  GridStyle,
  InputStyle,
  MarginStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { convertCurrency } from "@/utils/GeneralUtils";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { apiCoupon } from "@/api/Coupon";
import LoadingView from "@/components/Shared/LoadingView";
import GeneralButton from "@/components/Shared/GeneralButton";
import { ResponseApi } from "@/api/responseApi";

type formPayProps = {
  plan: PlanCardProps | null;
  totalToPay: number;
  coupon?: string;
  changeTotalToPay: (value: number) => void;
  changeCoupon: (value: string) => void;
  handlePay: () => void;
};

export const FormPay = ({
  plan,
  totalToPay,
  coupon,
  changeTotalToPay,
  changeCoupon,
  handlePay,
}: formPayProps) => {
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: couponData, isFetching: isFetchingCoupon } = useQuery({
    queryKey: [REACT_QUERY_KEYS.catalogs.coupon.getByCode("get-coupon")],
    queryFn: () => apiCoupon.getCoupon(coupon as string),
    ...{
      enabled: shouldFetch,
      select: (data: ResponseApi) => data.data,
    },
  });

  useEffect(() => {
    if (plan?.price) changeTotalToPay(plan?.price);
  }, [plan?.price]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (coupon) setShouldFetch(true);
    }, 1000);
    return () => {
      clearTimeout(handler);
      setShouldFetch(false);
    };
  }, [coupon]);

  useEffect(() => {
    if (plan?.price)
      if (couponData?.items) {
        changeTotalToPay(plan?.price - couponData?.items?.discountAmount);
      } else {
        changeTotalToPay(plan?.price);
      }
  }, [couponData]);

  return (
    <View
      style={{
        marginTop: 15,
        padding: 15,
        marginHorizontal: "auto",
        width: "90%",
      }}
    >
      <View>
        <ThemedText style={TextStyle.titleRegister}>
          Confirme su compra
        </ThemedText>
      </View>
      <View style={localStyle.rowContent}>
        <ThemedText style={TextStyle.label}>Plan seleccionado:</ThemedText>
        <ThemedText style={TextStyle.value}>{plan?.name}</ThemedText>
      </View>
      <View style={localStyle.rowContent}>
        <ThemedText style={TextStyle.label}>Costo:</ThemedText>
        <ThemedText style={TextStyle.value}>
          {plan?.price && convertCurrency(plan?.price, 0)}
        </ThemedText>
      </View>
      <View style={localStyle.rowContent}>
        <ThemedText style={TextStyle.label}>¿Tiene un cupon?</ThemedText>
        <TextInput style={localStyle.inputCoupon} onChangeText={changeCoupon} />
      </View>

      {isFetchingCoupon ? (
        <LoadingView styleProps={localStyle.loader} />
      ) : couponData ? (
        <View style={localStyle.rowContent}>
          <View>
            <ThemedText style={TextStyle.label}>Descuento de:</ThemedText>
            {couponData.error && (
              <ThemedText style={TextStyle.redColor}>
                {couponData.message}
              </ThemedText>
            )}
          </View>
          <ThemedText style={TextStyle.value}>
            {couponData?.items?.discountAmount &&
              convertCurrency(couponData?.items?.discountAmount, 0)}
          </ThemedText>
        </View>
      ) : (
        <></>
      )}

      <View style={localStyle.rowContent}>
        <ThemedText style={TextStyle.label}>Total a pagar:</ThemedText>
        <ThemedText style={TextStyle.value}>
          {totalToPay && convertCurrency(totalToPay, 0)}
        </ThemedText>
      </View>
      <View style={localStyle.rowContent}>
        <GeneralButton
          textBtn="Pagar"
          styleText={TextStyle.fontBoldWhite}
          styleBtn={localStyle.btnPay}
          handleOnPress={handlePay}
        />
      </View>
    </View>
  );
};

const localStyle = StyleSheet.create({
  rowContent: {
    ...GridStyle.rowSpaceBetween,
    ...MarginStyle.marginT10,
    height: 40,
    alignItems: "center",
  },
  inputCoupon: {
    ...InputStyle.withBorder,
    ...TextStyle.value,
    padding: 5,
    fontSize: 18,
    width: 100,
  },
  btnPay: {
    ...ButtonGeneralStyle.btnSaveSthetic,
    marginHorizontal: "auto",
    width: "90%",
  },
  loader: {
    marginTop: 10,
    height: 40,
  },
});

export default FormPay;
