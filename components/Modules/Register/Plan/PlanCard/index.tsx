import { GlobalColors } from "@/constants/Colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type BenefitsPlan = {
  id: number;
  descriptionEs: string;
};

export type PlanCardProps = {
  id: string;
  name: string;
  price: number;
  planDetails: BenefitsPlan[];
  onSelectPlan: (plan: PlanCardProps) => void;
};

export const PlanCard = (detailPlan: PlanCardProps) => {
  return (
    <View style={localStyles.card}>
      <View style={localStyles.cardHeader}>
        <Text style={localStyles.title}>{detailPlan.name}</Text>
        <Text style={localStyles.price}>${detailPlan.price} / mes</Text>
      </View>
      <View style={localStyles.benefitsContainer}>
        {detailPlan.planDetails.map((benefit: BenefitsPlan) => (
          <Text key={benefit.id} style={localStyles.benefit}>
            - {benefit.descriptionEs}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        style={localStyles.button}
        onPress={() => detailPlan.onSelectPlan(detailPlan)}
      >
        <Text style={localStyles.buttonText}>Suscribirse</Text>
      </TouchableOpacity>
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
    color: GlobalColors.blackColor,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: GlobalColors.cianColor,
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefit: {
    fontSize: 16,
    color: GlobalColors.grayColor,
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
