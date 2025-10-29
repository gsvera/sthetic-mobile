import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { Dimensions, Platform, ScrollView, View } from "react-native";
import { functionServicesType } from "../types";
import ItemTraining from "./ItemTraining";
import { useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import apiUserConfig from "@/api/UserConfig";
import { ResponseApi } from "@/api/responseApi";
import { TrainingType } from "@/constants/GeneralTypes";
import LoadingView from "@/components/Shared/LoadingView";
import { MarginStyle } from "@/constants/StyleComponents";
import { PLATFORM_TYPE } from "@/constants/Constants";

export const Training = ({ idUser, returnBack }: functionServicesType) => {
  const { height } = Dimensions.get("window");
  const { data: listTraining = [], isLoading: isLoadingTraining } = useQuery({
    queryKey: [REACT_QUERY_KEYS.userConfig.getTraining(idUser as string)],
    queryFn: () => apiUserConfig.getTraining(),
    ...{
      enabled: Boolean(idUser),
      select: (data: ResponseApi) => data.data.items as Array<TrainingType>,
    },
  });

  return (
    <View
      style={{
        flex: 1,
        marginBottom: Platform.OS === PLATFORM_TYPE.IOS ? height * 0.05 : 0,
      }}
    >
      <SubHeaderReturn subtitle="Tutoriales" handleReturn={returnBack} />
      <View
        style={{
          padding: 10,
          flex: 1,
        }}
      >
        {isLoadingTraining ? (
          <View style={MarginStyle.marginT100}>
            <LoadingView />
          </View>
        ) : (
          <ScrollView style={{ flexGrow: 1 }}>
            {listTraining
              ?.sort((a, b) => a.orderShow - b.orderShow)
              .map((item) => (
                <ItemTraining key={item.id} item={item} />
              ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default Training;
