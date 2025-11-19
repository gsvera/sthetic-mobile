import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ResponseApi } from "@/api/responseApi";
import { apiUser } from "@/api/User";
import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";
import EmptyView from "@/components/Shared/EmptyView";
import LoadingView from "@/components/Shared/LoadingView";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { HistoryPayType, modalCustomProps } from "@/constants/GeneralTypes";
import { MarginStyle, TextStyle } from "@/constants/StyleComponents";
import { useQuery } from "@tanstack/react-query";
import { Modal, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ListItemHistoryPay from "./ListItemHistoryPay";

export const HistoryPayModal = ({
  open,
  handleCloseModal,
  idUser,
}: modalCustomProps) => {
  const insets = useSafeAreaInsets();
  const { data: listHistoryPay = [], isLoading: isLoadingHistoryPay } =
    useQuery({
      queryKey: [REACT_QUERY_KEYS.user.getHistoryPay],
      queryFn: () => apiUser.getHistoryPay(idUser),
      ...{
        enabled: Boolean(idUser),
        select: (data: ResponseApi) => data.data.items,
      },
    });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={handleCloseModal}
    >
      <View
        style={{
          top: insets.top,
          bottom: insets.bottom,
          paddingVertical: 20,
          backgroundColor: ThemeColorsSthetic.shadowBackground,
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: ThemeColorsSthetic.backgroundLight,
            height: "70%",
            marginTop: 50,
          }}
        >
          <ButtonCloseModal handleOnPress={handleCloseModal} />
          <ThemedText style={{ ...TextStyle.titleModal, paddingBottom: 10 }}>
            Hstorial de pagos
          </ThemedText>
          {isLoadingHistoryPay ? (
            <View style={MarginStyle.marginT100}>
              <LoadingView />
            </View>
          ) : listHistoryPay.length > 0 ? (
            <View style={{ height: "80%", marginTop: 20 }}>
              <ScrollView>
                {listHistoryPay.map((item: HistoryPayType) => (
                  <ListItemHistoryPay key={item.id} item={item} />
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={MarginStyle.marginT100}>
              <EmptyView />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default HistoryPayModal;
