import GeneralButton from "@/components/Shared/GeneralButton";
import { GlobalColors, ThemeColorsSthetic } from "@/constants/Colors";
import { ButtonGeneralStyle, TextStyle } from "@/constants/StyleComponents";
import { convertCurrency } from "@/utils/GeneralUtils";
import { StyleSheet, Text, View } from "react-native";

type BenefitsPlan = {
  id: number;
  descriptionEs: string;
};

export type PlanCardProps = {
  id: number;
  name: string;
  price: number;
  duration: number;
  planDetails: BenefitsPlan[];
  onSelectPlan: (plan: PlanCardProps) => void;
};

export const PlanCard = (detailPlan: PlanCardProps) => {
  return (
    <View style={localStyles.card}>
      <View style={localStyles.cardHeader}>
        <Text style={localStyles.title}>{detailPlan.name}</Text>
        <Text style={localStyles.price}>
          {convertCurrency(detailPlan.price, 0)} x{" "}
          {detailPlan.duration < 2 ? "mes" : `${detailPlan.duration} meses`}
        </Text>
      </View>
      <View style={localStyles.benefitsContainer}>
        {detailPlan.planDetails.map((benefit: BenefitsPlan) => (
          <Text key={benefit.id} style={localStyles.benefit}>
            - {benefit.descriptionEs}
          </Text>
        ))}
      </View>
      <GeneralButton
        textBtn="Elegir plan"
        styleText={TextStyle.fontBoldWhite}
        styleBtn={ButtonGeneralStyle.btnSaveSthetic}
        handleOnPress={() => detailPlan.onSelectPlan(detailPlan)}
      />
    </View>
  );
};

export const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: GlobalColors.whiteColor,
    shadowColor: GlobalColors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Sombra para Android
    marginVertical: 10,
    marginHorizontal: "auto",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: ThemeColorsSthetic.textOre,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: ThemeColorsSthetic.textLabels,
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefit: {
    fontSize: 16,
    color: ThemeColorsSthetic.muted,
    marginBottom: 5,
    textAlign: "center",
  },
  button: {
    backgroundColor: GlobalColors.pinkColor,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: GlobalColors.whiteColor,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PlanCard;
