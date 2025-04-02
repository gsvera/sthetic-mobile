import { Pressable, StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { Feather, SimpleLineIcons } from "@expo/vector-icons";

type videoWithOptionsProps = {
  id: any;
  uri: string;
  iconDelete?: "close" | "trash";
  styleImg?: {};
  /**Determina si esta en bucle el video */
  loop: boolean;
  deleteAction?: (id: number | string) => void;
};
/**
 * Este componente sera para un futuro como vaya creciendo el proyecto ya que el peso de los videos puede ser un problema a corto plazo, y se requiere servicios externos para su gestion
 * @param param0
 * @returns
 */
export const VideoWithOptions = ({
  id,
  uri,
  iconDelete,
  styleImg,
  deleteAction,
  loop = false,
}: videoWithOptionsProps) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = loop;
    // player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const handleRemoveVideo = () => {
    deleteAction?.(id);
  };
  return (
    <View style={styleImg || localStyle.contentImg}>
      <Pressable style={localStyle.removeIconImg} onPress={handleRemoveVideo}>
        {iconDelete === "trash" ? (
          <Feather name="trash" size={24} color="red" />
        ) : (
          <SimpleLineIcons name="close" size={24} color="black" />
        )}
      </Pressable>
      <VideoView
        style={localStyle.video}
        player={player}
        allowsFullscreen={false}
        // allowsPictureInPicture
      />
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
  video: {
    width: "100%",
    height: "100%",
  },
});

export default VideoWithOptions;
