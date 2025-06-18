import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { Platform, ScrollView, View } from "react-native";
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
  const { data: listTraining = [], isLoading: isLoadingTraining } = useQuery({
    queryKey: [REACT_QUERY_KEYS.userConfig.getTraining(idUser as string)],
    queryFn: () => apiUserConfig.getTraining(),
    ...{
      enabled: Boolean(idUser),
      select: (data: ResponseApi) => data.data.items as Array<TrainingType>,
    },
  });

  return (
    <View>
      <SubHeaderReturn subtitle="Tutoriales" handleReturn={returnBack} />
      <View
        style={{
          padding: 10,
          height: Platform.OS === PLATFORM_TYPE.IOS ? "87%" : "88%",
        }}
      >
        {isLoadingTraining ? (
          <View style={MarginStyle.marginT100}>
            <LoadingView />
          </View>
        ) : (
          <ScrollView>
            {listTraining
              ?.sort((a, b) => a.order - b.order)
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
