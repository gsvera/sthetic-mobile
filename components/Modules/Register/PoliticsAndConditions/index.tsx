import { ThemedText } from "@/components/ThemedText";
import { ScrollView, StyleSheet, View } from "react-native";
import Checkbox from "expo-checkbox";
import { GlobalColors } from "@/constants/Colors";

type PoliticstAndConditionsProps = {
  stateCheck: boolean;
  handleAgreeTerms: (isChecked: boolean) => void;
};

export default function PoliticsAndConditions({
  stateCheck,
  handleAgreeTerms,
}: PoliticstAndConditionsProps) {
  return (
    <View style={localStyles.contentPolitics}>
      <View style={localStyles.contentSubtitle}>
        <ThemedText type="title" style={localStyles.subtitle}>
          Terminos y condiciones
        </ThemedText>
      </View>
      <ScrollView style={localStyles.contentText}>
        {/* ESTO DEBE CAMBIARSE POR LOS TEXTO REALES */}
        <ThemedText style={localStyles.text}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex id odit
          doloribus rem, delectus ea voluptatibus quibusdam adipisci
          accusantium? Optio voluptas voluptatem libero minus explicabo rem
          accusamus suscipit dolorem quaerat.
        </ThemedText>
        <ThemedText style={localStyles.text}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex id odit
          doloribus rem, delectus ea voluptatibus quibusdam adipisci
          accusantium? Optio voluptas voluptatem libero minus explicabo rem
          accusamus suscipit dolorem quaerat.
        </ThemedText>
        <ThemedText style={localStyles.text}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex id odit
          doloribus rem, delectus ea voluptatibus quibusdam adipisci
          accusantium? Optio voluptas voluptatem libero minus explicabo rem
          accusamus suscipit dolorem quaerat.
        </ThemedText>
        <ThemedText style={localStyles.text}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex id odit
          doloribus rem, delectus ea voluptatibus quibusdam adipisci
          accusantium? Optio voluptas voluptatem libero minus explicabo rem
          accusamus suscipit dolorem quaerat.
        </ThemedText>
        <ThemedText style={localStyles.text}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex id odit
          doloribus rem, delectus ea voluptatibus quibusdam adipisci
          accusantium? Optio voluptas voluptatem libero minus explicabo rem
          accusamus suscipit dolorem quaerat.
        </ThemedText>
        <ThemedText style={localStyles.text}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex id odit
          doloribus rem, delectus ea voluptatibus quibusdam adipisci
          accusantium? Optio voluptas voluptatem libero minus explicabo rem
          accusamus suscipit dolorem quaerat.
        </ThemedText>
      </ScrollView>
      <View style={localStyles.contentCheck}>
        <Checkbox
          value={stateCheck}
          onValueChange={(even) => handleAgreeTerms(even)}
        />
        <ThemedText style={localStyles.textAgree}>
          Aceptar terminos y condiciones
        </ThemedText>
      </View>
    </View>
  );
}

export const localStyles = StyleSheet.create({
  contentPolitics: {
    paddingTop: 15,
  },
  contentSubtitle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: GlobalColors.blackColor,
    fontWeight: "bold",
  },
  text: {
    color: GlobalColors.blackColor,
    marginBottom: 15,
    textAlign: "justify",
  },
  textAgree: {
    color: GlobalColors.blueColor,
    fontWeight: "bold",
    marginLeft: 10,
  },
  contentText: {
    width: "85%",
    height: "75%",
    marginHorizontal: "auto",
    marginBottom: 15,
  },
  contentCheck: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    marginHorizontal: "auto",
  },
});
