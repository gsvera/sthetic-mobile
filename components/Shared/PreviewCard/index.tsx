import { ThemedText } from "@/components/ThemedText";
import { GlobalColors } from "@/constants/Colors";
import { TextStyle } from "@/constants/StyleComponents";
import { convertCurrency } from "@/utils/GeneralUtils";
import { StyleSheet, View } from "react-native";
import ImageWithOptions from "../ImageWithOptions";

type detailPrevieCardType = {
  id: number;
  fileBase64: string;
};

export type previewCardProps = {
  id: number;
  nameService: string;
  minPrice?: number;
  maxPrice?: number;
  totalElement: number;
  catalogUserServiceDetailDTO: detailPrevieCardType;
  deleteProject: (id: number) => void;
};

export const PreviewCard = (element: previewCardProps) => {
  const deleteProject = () => {
    element.deleteProject(element.id);
  };
  return (
    <View style={localStyle.previewCard}>
      <ImageWithOptions
        id={element.id}
        uri={element.catalogUserServiceDetailDTO.fileBase64}
        deleteAction={deleteProject}
        iconDelete="trash"
        styleImg={localStyle.previewCardImage}
      />

      <ThemedText style={localStyle.titlePreviewCard} darkColor="black">
        {element.nameService}
      </ThemedText>
      <ThemedText style={TextStyle.fontBoldDark}>Archivos:</ThemedText>
      <ThemedText style={TextStyle.darkColor}>
        {element.totalElement}
      </ThemedText>
      <ThemedText style={TextStyle.fontBoldDark}>Rango de precios:</ThemedText>
      <ThemedText style={TextStyle.darkColor}>
        {element.minPrice && convertCurrency(element.minPrice)} -{" "}
        {element.maxPrice && convertCurrency(element.maxPrice)}
      </ThemedText>
    </View>
  );
};

const localStyle = StyleSheet.create({
  previewCard: {
    width: "50%",
    marginVertical: 10,
  },
  previewCardImage: {
    width: 150,
    height: 150,
  },
  titlePreviewCard: {
    fontWeight: "bold",
    color: GlobalColors.blueColor,
  },
});

export default PreviewCard;
