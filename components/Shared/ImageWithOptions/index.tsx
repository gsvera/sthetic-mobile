import { SimpleLineIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { Image, Pressable, StyleSheet, View } from "react-native";

export type imageWithOptiosProps = {
  id: any;
  uri: string;
  iconDelete?: "close" | "trash";
  styleImg?: {};
  deleteAction: (id: number | string) => void;
};

export const ImageWithOptions = ({
  id,
  uri,
  deleteAction,
  iconDelete,
  styleImg,
}: imageWithOptiosProps) => {
  const handleRemovePicture = (id: number | string) => {
    deleteAction(id);
  };
  return (
    <View style={styleImg || localStyle.contentImg}>
      <Pressable
        style={localStyle.removeIconImg}
        onPress={() => handleRemovePicture(id)}
      >
        {iconDelete === "trash" ? (
          <Feather name="trash" size={24} color="red" />
        ) : (
          <SimpleLineIcons name="close" size={24} color="black" />
        )}
      </Pressable>
      <Image style={localStyle.image} source={{ uri: uri }} />
    </View>
  );
};

const localStyle = StyleSheet.create({
  contentImg: {
    width: 110,
    height: 110,
    margin: 5,
  },
  removeIconImg: {
    position: "absolute",
    margin: 10,
    right: -2,
    zIndex: 2,
    alignSelf: "flex-end",
    padding: 5,
    backgroundColor: "white",
    borderRadius: 50,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImageWithOptions;
