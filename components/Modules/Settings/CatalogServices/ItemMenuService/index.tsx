import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { CatalogService } from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { convertCurrency } from "@/utils/GeneralUtils";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type itemMenuServiceProps = {
  register: CatalogService;
  handleSelect: (id: number) => void;
  handleSelectDelete: (id: number) => void;
};

export const ItemMenuService = ({
  register,
  handleSelect,
  handleSelectDelete,
}: itemMenuServiceProps) => {
  return (
    <View style={localStyle.card}>
      <ThemedText style={localStyle.titleCard}>
        {register.nameService}
      </ThemedText>
      <View style={GridStyle.rowSpaceBetween}>
        <View>
          <ThemedText style={localStyle.label}>Precio:</ThemedText>
          <ThemedText style={localStyle.value}>
            {convertCurrency(register.price)}
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyle.label}>Personas:</ThemedText>
          <ThemedText style={localStyle.value}>{register.people}</ThemedText>
        </View>
        <View style={localStyle.contentBtn}>
          <GeneralButton
            textBtn={
              <Feather
                name="trash"
                size={24}
                color={ThemeColorsSthetic.textLight}
              />
            }
            styleText={TextStyle.fontBoldWhite}
            styleBtn={localStyle.btnDelete}
            handleOnPress={() => handleSelectDelete(register.id)}
          />
          <GeneralButton
            textBtn={
              <Feather
                name="edit-3"
                size={24}
                color={ThemeColorsSthetic.textLight}
              />
            }
            styleText={TextStyle.fontBoldWhite}
            styleBtn={localStyle.btnEdit}
            handleOnPress={() => handleSelect(register.id)}
          />
        </View>
      </View>
    </View>
  );
};

const localStyle = StyleSheet.create({
  card: {
    borderWidth: 0.5,
    borderRadius: 3,
    padding: 10,
    marginVertical: 5,
  },
  titleCard: {
    color: ThemeColorsSthetic.textTitle,
    fontWeight: "bold",
    fontSize: 20,
  },
  label: {
    color: ThemeColorsSthetic.accentReverse,
    fontWeight: "bold",
    fontSize: 16,
  },
  value: {
    color: ThemeColorsSthetic.text,
    fontSize: 17,
    textAlign: "center",
  },
  contentBtn: {
    ...GridStyle.rowFlexEnd,
    marginTop: 5,
  },
  btnEdit: {
    ...ButtonGeneralStyle.btnActionSthetic,
    marginLeft: 10,
    paddingTop: 6,
  },
  btnDelete: {
    ...ButtonGeneralStyle.btnDeleteSthetic,
    paddingTop: 6,
  },
});

export default ItemMenuService;
