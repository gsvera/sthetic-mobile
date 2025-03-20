import { View } from "react-native";
import { functionServicesType } from "../types";
import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";

export const TypeServices = ({ returnBack }: functionServicesType) => {
  return (
    <View>
      <SubHeaderReturn subtitle="Tipo de servicios" handleReturn={returnBack} />
    </View>
  );
};

export default TypeServices;
