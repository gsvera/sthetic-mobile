import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "@/components/ThemedText";
import { GlobalColors } from "@/constants/Colors";
import { functionServicesType } from "../types";

export const ServicesCatalog = ({ returnBack }: functionServicesType) => {
  return (
    <View>
      <SubHeaderReturn
        subtitle="Catálogo de servicios"
        handleReturn={returnBack}
      />
      <View style={localStyle.contentBtnAdd}>
        <TouchableOpacity style={localStyle.btnAddProject}>
          <View style={localStyle.btnContent}>
            <ThemedText
              lightColor="white"
              style={{
                fontWeight: "bold",
              }}
            >
              Agregar portafolio{"  "}
            </ThemedText>
            <MaterialIcons name="add-photo-alternate" size={22} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const localStyle = StyleSheet.create({
  contentBtnAdd: {
    justifyContent: "flex-end",
    flexDirection: "row",
    marginTop: 10,
    marginRight: 10,
  },
  btnAddProject: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 2,
    backgroundColor: GlobalColors.blueColor,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ServicesCatalog;
