import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiSchedule } from "@/api/Schedule";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { ScrollView, View } from "react-native";
import {
  DataChangeStatusSchedule,
  ScheduleType,
  StatusScheduleType,
} from "@/constants/GeneralTypes";
import ScheduleItem from "./ScheduleItem";
import ModalRejectSchedule from "./ModalRejectSchedule";
import { useState } from "react";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { STATUS_SERVICE, TYPE_STATUS } from "@/constants/Constants";
import LoadingView from "@/components/Shared/LoadingView";
import { GridStyle } from "@/constants/StyleComponents";
import EmptyView from "@/components/Shared/EmptyView";

type schedulesProps = {
  idUser: string;
  day: string;
  statusSchedule: StatusScheduleType;
};

export const Schedules = ({ idUser, day, statusSchedule }: schedulesProps) => {
  const queryClient = useQueryClient();
  const { handleNotification } = useNotificationProvider();
  const [openRejectSchedule, setOpenRejectSchedule] = useState(false);
  const [idSchedule, setIdSchedule] = useState(0);

  const { data: listSchedule = [], isFetching: isFetchingSchedules } = useQuery(
    {
      queryKey: [
        REACT_QUERY_KEYS.schedule.getAllByDay(idUser),
        day,
        statusSchedule,
      ],
      queryFn: () => apiSchedule.findAllByDay(idUser, day, statusSchedule),
      ...{
        select: (data: ResponseApi) => data.data.items as Array<ScheduleType>,
        enabled: Boolean(idUser && day),
      },
    }
  );

  const { mutate: changeStatusSchedule } = useMutation({
    mutationFn: (data: any) => apiSchedule.changeStatusSchedule(data),
    onSuccess: (data: ResponseApi, variables) =>
      handleSuccessChangeStatusSchedule(data.data, variables),
    onError: ErrorAlertMessage,
  });

  const handleSuccessChangeStatusSchedule = (
    data: ObjectResponse,
    variables: DataChangeStatusSchedule
  ) => {
    if (data.error)
      return handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });

    queryClient.invalidateQueries({
      queryKey: [REACT_QUERY_KEYS.schedule.getAllByDay(idUser), day],
    });

    var menssage =
      variables.statusSchedule === STATUS_SERVICE.ACCEPT
        ? "Se acepto con éxito la reservación"
        : "Se rechazo con éxito la reservación";

    handleNotification({ type: TYPE_STATUS.SUCCESS, message: menssage });
  };

  const handleOpenRejectModal = (id: number) => {
    setIdSchedule(id);
    setOpenRejectSchedule(true);
  };

  const handleCloseRejectModal = () => {
    setOpenRejectSchedule(false);
    setIdSchedule(0);
  };

  const handleAcceptSchedule = (idSchedule: number) => {
    changeStatusSchedule({
      idSchedule,
      statusSchedule: STATUS_SERVICE.ACCEPT,
    });
  };

  const handleRejectSchedule = (textReject: string | undefined) => {
    changeStatusSchedule({
      idSchedule,
      statusSchedule: STATUS_SERVICE.REJECT,
      textComments: textReject,
    });
  };

  return (
    <View>
      {isFetchingSchedules ? (
        <View style={{ marginTop: 100 }}>
          <LoadingView />
        </View>
      ) : (
        <ScrollView>
          {listSchedule.length > 0 ? (
            listSchedule?.map((item) => (
              <ScheduleItem
                key={item.id}
                item={item}
                handleAcceptService={handleAcceptSchedule}
                handleRejectSchedule={handleOpenRejectModal}
              />
            ))
          ) : (
            <View
              style={{ ...GridStyle.rowItemsVerticalCenter, marginTop: 100 }}
            >
              <EmptyView />
            </View>
          )}
        </ScrollView>
      )}
      <ModalRejectSchedule
        open={openRejectSchedule}
        handleCloseModal={handleCloseRejectModal}
        handleConfirmModal={handleRejectSchedule}
      />
    </View>
  );
};

export default Schedules;
