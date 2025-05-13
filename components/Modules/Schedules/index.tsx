import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiSchedule } from "@/api/Schedule";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { ScrollView, View } from "react-native";
import { ScheduleType } from "@/constants/GeneralTypes";
import ScheduleItem from "./ScheduleItem";
import ModalRejectSchedule from "./ModalRejectSchedule";
import { useState } from "react";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { TYPE_STATUS } from "@/constants/Constants";

type schedulesProps = {
  idUser: string;
  day: string;
};

export const Schedules = ({ idUser, day }: schedulesProps) => {
  const queryClient = useQueryClient();
  const { handleNotification } = useNotificationProvider();
  const [openRejectSchedule, setOpenRejectSchedule] = useState(false);
  const [idSchedule, setIdSchedule] = useState(0);

  const { data: listSchedule = [] } = useQuery({
    queryKey: [REACT_QUERY_KEYS.schedule.getAllByDay(idUser), day],
    queryFn: () => apiSchedule.findAllByDay(idUser, day),
    ...{
      select: (data: ResponseApi) => data.data.items as Array<ScheduleType>,
      enabled: Boolean(idUser && day),
    },
  });

  const { mutate: acceptSchedule } = useMutation({
    mutationFn: (idSchedule: number) => apiSchedule.acceptSchedule(idSchedule),
    onSuccess: (data: ResponseApi) => handleSuccessMutations(data.data),
    onError: ErrorAlertMessage,
  });

  const { mutate: rejectSchedule } = useMutation({
    mutationFn: (data: any) => apiSchedule.rejectSchedule(data),
    onSuccess: (data: ResponseApi) => handleSuccessMutations(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessMutations = (data: ObjectResponse) => {
    if (data.error)
      return handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });

    queryClient.invalidateQueries({
      queryKey: [REACT_QUERY_KEYS.schedule.getAllByDay(idUser), day],
    });
    handleNotification({ type: TYPE_STATUS.SUCCESS, message: data.message });
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
    acceptSchedule(idSchedule);
  };

  const handleRejectSchedule = (textReject: string | undefined) => {
    rejectSchedule({
      idSchedule,
      textReject,
    });
  };

  return (
    <View>
      <ScrollView>
        {listSchedule?.map((item) => (
          <ScheduleItem
            key={item.id}
            item={item}
            handleAcceptService={handleAcceptSchedule}
            handleRejectSchedule={handleOpenRejectModal}
          />
        ))}
      </ScrollView>
      <ModalRejectSchedule
        open={openRejectSchedule}
        handleCloseModal={handleCloseRejectModal}
        handleConfirmModal={handleRejectSchedule}
      />
    </View>
  );
};

export default Schedules;
