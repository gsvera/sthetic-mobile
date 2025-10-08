import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { MenuServiceType } from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { convertCurrency } from "@/utils/GeneralUtils";
import { StyleSheet, View } from "react-native";

type optionServiceProps = {
  service: MenuServiceType;
  onSelect: (obj: MenuServiceType) => void;
};

export const OptionService = ({ service, onSelect }: optionServiceProps) => {
  return (
    <View style={localStyle.optionService}>
      <ThemedText style={TextStyle.titleModal}>
        {service.nameService}
      </ThemedText>
      <View style={GridStyle.rowSpaceBetween}>
        <ThemedText style={TextStyle.label}>
          {service.people > 1
            ? `Para ${service.people} personas`
            : "Por persona"}
        </ThemedText>
        <ThemedText style={TextStyle.fontTitleBold}>
          {convertCurrency(service.price)}
        </ThemedText>
      </View>
      <GeneralButton
        textBtn="Seleccionar"
        styleText={TextStyle.fontBoldWhite}
        styleBtn={localStyle.btn}
        handleOnPress={() => onSelect(service)}
      />
    </View>
  );
};

const localStyle = StyleSheet.create({
  optionService: {
    margin: 10,
    padding: 10,
    borderWidth: 0.5,
    borderColor: ThemeColorsSthetic.backgroundStrong,
  },
  btn: {
    ...ButtonGeneralStyle.btnAction,
    marginTop: 15,
    marginBottom: 5,
  },
});

export default OptionService;
