import { ThemedText } from "@/components/ThemedText";
import { GlobalColors, textColors } from "@/constants/Colors";
import { ButtonGeneralStyle, TextStyle } from "@/constants/StyleComponents";
import { convertCurrency } from "@/utils/GeneralUtils";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ImageWithOptions from "../ImageWithOptions";
import VideoWithOptions from "../VideoWithOptions";

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
  editProject: (id: number) => void;
  deleteProject: (id: number) => void;
};

/**
 *  ESTE ARCHIVO TIENE COMENTADO LOS COMPONENTE PARA VIDEO QUE SE UTILIZARAN EN UN FUTURO
 * @param element
 * @returns
 */
export const PreviewCard = (element: previewCardProps) => {
  const handleDeleteProject = () => {
    element.deleteProject(element.id);
  };

  const handleEditProject = () => {
    element.editProject(element.id);
  };

  return (
    <View style={localStyle.previewCard}>
      {/* {element.catalogUserServiceDetailDTO.fileBase64.includes("image") ? ( */}
      <ImageWithOptions
        id={element.id}
        uri={element.catalogUserServiceDetailDTO.fileBase64}
        deleteAction={handleDeleteProject}
        iconDelete="trash"
        styleImg={localStyle.previewCardImage}
      />
      {/* ) : (
        <VideoWithOptions
          id={element.id}
          uri={element.catalogUserServiceDetailDTO.fileBase64}
          deleteAction={deleteProject}
          iconDelete="trash"
          styleImg={localStyle.previewCardImage}
          loop
        />
      )} */}

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
      <TouchableOpacity
        style={{ ...ButtonGeneralStyle.btnInfo, ...localStyle.widthBtn }}
        onPress={handleEditProject}
      >
        <ThemedText style={{ ...TextStyle.lightColor, ...TextStyle.bold }}>
          Editar
        </ThemedText>
      </TouchableOpacity>
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
  widthBtn: {
    width: "80%",
    marginVertical: 5,
    marginHorizontal: "auto",
  },
});

export default PreviewCard;
