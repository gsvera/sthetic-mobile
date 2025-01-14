import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "../../../ThemedText";
import PlanCard, { PlanCardProps } from "./PlanCard";
import { useQuery } from "@tanstack/react-query";
import { apiPlan } from "@/api/Plan";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";

type PlanProps = {
  selectedPlan: (idPlan: PlanCardProps) => void;
};

export const Plan = ({ selectedPlan }: PlanProps) => {
  const handleSelectedPlan = (plan: PlanCardProps) => {
    selectedPlan(plan);
  };

  const { data: dataPlans = [] } = useQuery({
    queryKey: [REACT_QUERY_KEYS.plan.getFilterData("register")],
    queryFn: () => apiPlan.getAllPlans(),
    ...{
      select: (data: any) => data?.data?.items,
    },
  });

  return (
    <View>
      <View
        style={{
          marginBottom: 15,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <ThemedText type="title" style={localStyles.subtitle}>
          Seleecione un plan
        </ThemedText>
      </View>
      <View style={localStyles.constentScroll}>
        <ScrollView contentContainerStyle={localStyles.scrollContainer}>
          <View style={localStyles.content}>
            {dataPlans.map((item: PlanCardProps) => (
              <View key={item.id}>
                <PlanCard {...item} onSelectPlan={handleSelectedPlan} />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export const localStyles = StyleSheet.create({
  subtitle: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
  constentScroll: {
    height: 570,
  },
  scrollContainer: {
    // padding: 20,
    // backgroundColor: "red",
  },
  content: {
    // height: 900,
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Plan;
