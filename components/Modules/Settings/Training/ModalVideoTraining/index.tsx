import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { PLATFORM_TYPE } from "@/constants/Constants";
import { useVideoPlayer, VideoView } from "expo-video";
import { Modal, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type modalVideoTrainingProps = {
  open: boolean;
  linkVideo: string;
  handleClose: () => void;
};
export const ModalVideoTraining = ({
  open,
  linkVideo,
  handleClose,
}: modalVideoTrainingProps) => {
  const insets = useSafeAreaInsets();
  const player = useVideoPlayer(linkVideo, (player) => {
    player.loop = false;
    player.play();
  });

  return (
    <Modal visible={open} transparent={true} onRequestClose={handleClose}>
      <View
        style={{
          ...localStyle.modalView,
          top: Platform.OS === PLATFORM_TYPE.IOS ? insets.top : 0,
          flex: 1,
        }}
      >
        <View style={localStyle.container}>
          <ButtonCloseModal handleOnPress={handleClose} />
          <VideoView
            style={localStyle.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        </View>
      </View>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: ThemeColorsSthetic.shadowBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: ThemeColorsSthetic.backgroundLight,
  },
  video: {
    width: "100%",
    height: 300,
  },
});

export default ModalVideoTraining;
