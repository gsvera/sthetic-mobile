import { ThemedText } from "@/components/ThemedText";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import ModalVideoTraining from "../ModalVideoTraining";
import GeneralButton from "@/components/Shared/GeneralButton";
import { TrainingType } from "@/constants/GeneralTypes";
import { PLATFORM_TYPE } from "@/constants/Constants";

type itemTrainingProps = {
  item: TrainingType;
};

export const ItemTraining = ({ item }: itemTrainingProps) => {
  const [openModalVideo, setOpenModalVideo] = useState(false);
  return (
    <View style={localStyle.itemTraining}>
      <View
        style={{
          ...GridStyle.rowSpaceBetween,
          ...GridStyle.rowItemsVerticalCenter,
        }}
      >
        <View style={{ width: "70%" }}>
          <ThemedText style={localStyle.labelVideo}>
            {`${item.orderShow} - ${item.nameVideo}`}
          </ThemedText>
          {item?.description && (
            <ThemedText style={TextStyle.textNote}>
              {item.description}
            </ThemedText>
          )}
        </View>

        <GeneralButton
          styleText={TextStyle.fontBoldWhite}
          textBtn="Ver video"
          styleBtn={ButtonGeneralStyle.btnShortAction}
          handleOnPress={() => setOpenModalVideo(true)}
        />
      </View>
      {openModalVideo && (
        <ModalVideoTraining
          open={openModalVideo}
          linkVideo={item.linkVideo}
          handleClose={() => setOpenModalVideo(false)}
        />
      )}
    </View>
  );
};

const localStyle = StyleSheet.create({
  itemTraining: {
    borderRadius: 5,
    borderWidth: 0.2,
    marginVertical: Platform.OS === PLATFORM_TYPE.IOS ? 10 : 7,
    padding: 10,
  },
  labelVideo: {
    ...TextStyle.value,
    fontWeight: "bold",
  },
});

export default ItemTraining;
