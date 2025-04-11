import { AdminCalendarProvider } from "@/components/Modules/AdminCalendarProvider";
import { Container } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Calendar() {
  return (
    <SafeAreaView style={Container.container}>
      <AdminCalendarProvider />
    </SafeAreaView>
  );
}
