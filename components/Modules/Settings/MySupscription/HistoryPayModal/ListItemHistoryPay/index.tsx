import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { HistoryPayType } from "@/constants/GeneralTypes";
import { GridStyle, TextStyle } from "@/constants/StyleComponents";
import {
  convertCurrency,
  convertDateToGeneralFormat,
} from "@/utils/GeneralUtils";
import { StyleSheet, View } from "react-native";

type listItemHistoryPayProps = {
  item: HistoryPayType;
};

export const ListItemHistoryPay = ({ item }: listItemHistoryPayProps) => {
  return (
    <View style={localStyle.row}>
      <View>
        <ThemedText style={TextStyle.value}>
          {convertDateToGeneralFormat(item.paymentDate, "DD-MM-YYYY")}
        </ThemedText>
        <ThemedText style={TextStyle.textNote}>{item.namePlan}</ThemedText>
      </View>
      <View>
        <ThemedText style={TextStyle.fontBoldDark}>
          {item.amountPaid === 0 ? "$0" : convertCurrency(item.amountPaid)}
        </ThemedText>
        {item.discountApplied < 1 ? (
          ""
        ) : (
          <ThemedText style={localStyle.amountDiscount}>
            - {convertCurrency(item.discountApplied)}
          </ThemedText>
        )}
      </View>
    </View>
  );
};

const localStyle = StyleSheet.create({
  row: {
    ...GridStyle.rowSpaceBetween,
    paddingHorizontal: 25,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: ThemeColorsSthetic.disabled,
  },
  amountDiscount: {
    color: ThemeColorsSthetic.accent,
  },
});

export default ListItemHistoryPay;
