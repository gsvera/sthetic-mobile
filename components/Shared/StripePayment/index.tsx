import { ThemeColorsSthetic } from "@/constants/Colors";
import StripeProviderPayment from "@/provider/StripProvider";
import { ActivityIndicator, Modal, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ButtonCloseModal from "../ButtonCloseModal";
import { useStripe } from "@stripe/stripe-react-native";
import { useEffect, useMemo, useState } from "react";
import { apiUser } from "@/api/User";
import { ResponseApi } from "@/api/responseApi";
import GeneralButton from "../GeneralButton";
import {
  ButtonGeneralStyle,
  GridStyle,
  MarginStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { PLATFORM_TYPE, TYPE_STATUS } from "@/constants/Constants";
import { ThemedText } from "@/components/ThemedText";
import { convertCurrency } from "@/utils/GeneralUtils";
import { ObjPayType, StripeDataCustomerType } from "@/constants/GeneralTypes";

type stripePaymentProps = {
  open: boolean;
  objPay: ObjPayType;
  handleCancel: () => void;
  handleSuccesPayment: (data: StripeDataCustomerType) => void;
};

export const StripePayment = ({
  open,
  objPay,
  handleCancel,
  handleSuccesPayment,
}: stripePaymentProps) => {
  const insets = useSafeAreaInsets();
  const { handleNotification } = useNotificationProvider();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(true);
  const [dataPayCreated, setDatapayCreated] = useState<StripeDataCustomerType>({
    customerStripe: "",
    ephemeralKeyStripe: "",
    paymentIntentStripe: "",
  });

  const fetchPaymentSheetParams = async () => {
    const response: ResponseApi = await apiUser.makePaymentStrip({
      amount: objPay.amount,
      name: objPay.nameCustomer,
      emai: objPay.emailCustomer,
    });

    const { paymentIntent, ephemeralKey, customer } = await response.data.items;

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    setDatapayCreated({
      customerStripe: customer,
      paymentIntentStripe: paymentIntent,
      ephemeralKeyStripe: ephemeralKey,
    });

    const { error } = await initPaymentSheet({
      merchantDisplayName: "MerEasthetic",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      // allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: objPay.nameCustomer,
      },
    });
    if (!error) {
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    const { error, paymentOption } = await presentPaymentSheet();

    if (error) {
      handleNotification({
        type: TYPE_STATUS.ERROR,
        message: `Error al realizar el pago`,
      });
    } else {
      setLoading(true);
      handleSuccesPayment(dataPayCreated);
    }
  };

  const disableBtn = useMemo(
    () => loading || objPay.amount === 0,
    [loading, objPay.amount]
  );

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <StripeProviderPayment>
      <Modal animationType="fade" transparent={true} visible={open}>
        <View
          style={{
            backgroundColor: ThemeColorsSthetic.shadowBackground,
            justifyContent: "center",
            alignItems: "center",
            top: insets.top,
          }}
        >
          <View
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <View style={{ backgroundColor: "white" }}>
              <ButtonCloseModal handleOnPress={handleCancel} />
              <View style={{ width: "65%", marginHorizontal: "auto" }}>
                <View>
                  <ThemedText
                    style={{
                      ...TextStyle.fontBoldBlue,
                      ...TextStyle.center,
                      ...MarginStyle.marginB10,
                    }}
                  >
                    Detalles de pago
                  </ThemedText>
                </View>
                <View
                  style={{
                    ...GridStyle.rowSpaceBetween,
                    ...MarginStyle.marginB10,
                  }}
                >
                  <ThemedText style={TextStyle.fontBoldBlue}>Plan:</ThemedText>
                  <ThemedText style={TextStyle.fontBoldDark}>
                    {objPay.nameProduct}
                  </ThemedText>
                </View>
                <View
                  style={{
                    ...GridStyle.rowSpaceBetween,
                    ...MarginStyle.marginB10,
                  }}
                >
                  <ThemedText style={TextStyle.fontBoldBlue}>
                    Cliente:
                  </ThemedText>
                  <ThemedText style={TextStyle.fontBoldDark}>
                    {objPay.nameCustomer}
                  </ThemedText>
                </View>
                <View
                  style={{
                    ...GridStyle.rowSpaceBetween,
                    ...MarginStyle.marginB10,
                  }}
                >
                  <ThemedText style={TextStyle.fontBoldBlue}>
                    Total a pagar:
                  </ThemedText>
                  <ThemedText style={TextStyle.fontBoldDark}>
                    {convertCurrency(objPay.amount)}
                  </ThemedText>
                </View>
              </View>
              <View
                style={{
                  width: "90%",
                  marginHorizontal: "auto",
                  ...MarginStyle.marginY10,
                }}
              >
                <GeneralButton
                  handleOnPress={openPaymentSheet}
                  textBtn={
                    disableBtn ? <ActivityIndicator size={"small"} /> : "Pagar"
                  }
                  styleText={ThemeColorsSthetic.backgroundLight}
                  styleBtn={ButtonGeneralStyle.btnAction}
                  disabledBtn={disableBtn}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </StripeProviderPayment>
  );
};

export default StripePayment;
