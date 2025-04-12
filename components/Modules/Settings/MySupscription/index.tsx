import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { functionServicesType } from "../types";
import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { ThemedText } from "@/components/ThemedText";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import apiUserConfig from "@/api/UserConfig";
import { UserPlan } from "@/constants/GeneralTypes";
import {
  convertCurrency,
  convertDateToGeneralFormat,
} from "@/utils/GeneralUtils";
import { ThemeColorsSthetic } from "@/constants/Colors";
import GeneralButton from "@/components/Shared/GeneralButton";

export const MySupscription = ({
  idUser,
  returnBack,
}: functionServicesType) => {
  const { data: planData } = useQuery({
    queryKey: [REACT_QUERY_KEYS.plan.getByUser(idUser as string)],
    queryFn: () => apiUserConfig.getPlanByUser(idUser),
    ...{
      select: (data: ResponseAPi) => data.data.items as UserPlan,
    },
  });

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
            <ThemedText style={localStyle.textValue}>
              {planData?.isActive ? "Activo" : "Vencido"}
            </ThemedText>
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
            textBtn="Pagar"
            styleText={{ fontWeight: "bold" }}
            styleBtn={localStyle.btnPay}
            handleOnPress={() => {}}
          />
        </View>
      </View>
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
    ...TextStyle.size20,
    color: ThemeColorsSthetic.text,
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
});

export default MySupscription;
