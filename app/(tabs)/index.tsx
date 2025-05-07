import { ThemedText } from "@/components/ThemedText";

import { Container } from "@/constants/Colors";
import { View } from "react-native";

export default function Home() {
  return (
    <View style={Container.container}>
      <ThemedText style={{ color: "black" }}>Bienvenido</ThemedText>
    </View>
  );
}
