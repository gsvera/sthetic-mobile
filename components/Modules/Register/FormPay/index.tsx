import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
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
      select: (data: ResponseAPi) => data.data,
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
      <View style={localStyle.rowContent}>
        <ThemedText style={localStyle.textLabel}>Plan seleccionado:</ThemedText>
        <ThemedText style={localStyle.textValue}>{plan?.name}</ThemedText>
      </View>
      <View style={localStyle.rowContent}>
        <ThemedText style={localStyle.textLabel}>Costo:</ThemedText>
        <ThemedText style={localStyle.textValue}>
          {plan?.price && convertCurrency(plan?.price, 0)}
        </ThemedText>
      </View>
      <View style={localStyle.rowContent}>
        <ThemedText style={localStyle.textLabel}>¿Tiene un cupon?</ThemedText>
        <TextInput style={localStyle.inputCoupon} onChangeText={changeCoupon} />
      </View>

      {isFetchingCoupon ? (
        <LoadingView styleProps={localStyle.loader} />
      ) : couponData ? (
        <View style={localStyle.rowContent}>
          <View>
            <ThemedText style={localStyle.textLabel}>Descuento de:</ThemedText>
            {couponData.error && (
              <ThemedText style={TextStyle.redColor}>
                {couponData.message}
              </ThemedText>
            )}
          </View>
          <ThemedText style={localStyle.textValue}>
            {couponData?.items?.discountAmount &&
              convertCurrency(couponData?.items?.discountAmount, 0)}
          </ThemedText>
        </View>
      ) : (
        <></>
      )}

      <View style={localStyle.rowContent}>
        <ThemedText style={localStyle.textLabel}>Total a pagar:</ThemedText>
        <ThemedText style={localStyle.textValue}>
          {totalToPay && convertCurrency(totalToPay, 0)}
        </ThemedText>
      </View>
      <View style={localStyle.rowContent}>
        <TouchableOpacity style={localStyle.btnPay} onPress={handlePay}>
          <ThemedText>Pagar</ThemedText>
        </TouchableOpacity>
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
  textLabel: {
    ...TextStyle.fontBoldDark,
    ...TextStyle.size20,
  },
  textValue: {
    ...TextStyle.blueColor,
    ...TextStyle.size20,
  },
  inputCoupon: {
    ...InputStyle.withBorder,
    padding: 5,
    fontSize: 18,
    width: 100,
  },
  btnPay: {
    ...ButtonGeneralStyle.btnSuccess,
    marginHorizontal: "auto",
    width: "90%",
  },
  loader: {
    marginTop: 10,
    height: 40,
  },
});

export default FormPay;
