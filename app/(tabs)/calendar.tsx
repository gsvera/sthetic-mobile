import { AdminCalendarProvider } from "@/components/Modules/AdminCalendarProvider";
import { Container } from "@/constants/Colors";
import { View } from "react-native";

export default function Calendar() {
  return (
    <View style={Container.container}>
      <AdminCalendarProvider />
    </View>
  );
}
