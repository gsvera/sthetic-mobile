import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { ButtonGeneralStyle, TextStyle } from "@/constants/StyleComponents";
import { convertCurrency } from "@/utils/GeneralUtils";
import { StyleSheet, View } from "react-native";
import ImageWithOptions from "../ImageWithOptions";
import VideoWithOptions from "../VideoWithOptions";
import GeneralButton from "../GeneralButton";

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

      <ThemedText style={localStyle.titlePreviewCard}>
        {element.nameService}
      </ThemedText>
      <ThemedText style={localStyle.label}>Archivos:</ThemedText>
      <ThemedText style={localStyle.value}>{element.totalElement}</ThemedText>
      <ThemedText style={localStyle.label}>Rango de precios:</ThemedText>
      <ThemedText style={localStyle.value}>
        {element.minPrice && convertCurrency(element.minPrice)} -{" "}
        {element.maxPrice && convertCurrency(element.maxPrice)}
      </ThemedText>
      <GeneralButton
        styleBtn={localStyle.btnEdit}
        textBtn="Actualizar datos"
        styleText={TextStyle.fontBoldWhite}
        handleOnPress={handleEditProject}
      />
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
    color: ThemeColorsSthetic.text,
  },
  label: {
    ...TextStyle.bold,
    color: ThemeColorsSthetic.textLabels,
  },
  value: {
    color: ThemeColorsSthetic.text,
  },
  btnEdit: {
    ...ButtonGeneralStyle.btnActionSthetic,
    width: "80%",
    marginVertical: 5,
    marginHorizontal: "auto",
  },
});

export default PreviewCard;
