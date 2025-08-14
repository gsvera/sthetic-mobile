import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiSchedule } from "@/api/Schedule";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { ScrollView, View } from "react-native";
import { ScheduleType, StatusScheduleType } from "@/constants/GeneralTypes";
import ScheduleItem from "./ScheduleItem";
import ModalRejectSchedule from "./ModalRejectSchedule";
import { useState } from "react";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { TYPE_STATUS } from "@/constants/Constants";
import LoadingView from "@/components/Shared/LoadingView";
import { GridStyle, MarginStyle } from "@/constants/StyleComponents";
import EmptyView from "@/components/Shared/EmptyView";
import dayjs from "dayjs";

export type scheduleSelectType = {
  id: number;
  statusSchedule: number;
  comments?: string;
};

type schedulesProps = {
  idUser: string;
  day: string;
  statusSchedule: StatusScheduleType;
};

export const Schedules = ({ idUser, day, statusSchedule }: schedulesProps) => {
  const queryClient = useQueryClient();
  const { handleNotification } = useNotificationProvider();
  const [openRejectSchedule, setOpenRejectSchedule] = useState(false);
  const [schedule, setSchedule] = useState<scheduleSelectType>();

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
      handleSuccessChangeStatusSchedule(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessChangeStatusSchedule = (data: ObjectResponse) => {
    if (data.error)
      return handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });

    queryClient.invalidateQueries({
      queryKey: [REACT_QUERY_KEYS.schedule.getAllByDay(idUser), day],
    });

    handleNotification({
      type: TYPE_STATUS.SUCCESS,
      message: `Se ha cambiado el estatus de la reservación con éxito`,
    });
  };

  const handleOpenRejectModal = (data: scheduleSelectType) => {
    setSchedule(data);
    setOpenRejectSchedule(true);
  };

  const handleCloseRejectModal = () => {
    setOpenRejectSchedule(false);
    setSchedule(undefined);
  };

  const handleAcceptSchedule = (data: scheduleSelectType) => {
    changeStatusSchedule({
      idSchedule: data.id,
      statusSchedule: data.statusSchedule,
    });
  };

  const handleRejectSchedule = (textReject: string | undefined) => {
    if (schedule)
      changeStatusSchedule({
        idSchedule: schedule.id,
        statusSchedule: schedule.statusSchedule,
        textComments: textReject,
      });
  };

  return (
    <View>
      {isFetchingSchedules ? (
        <View style={MarginStyle.marginT100}>
          <LoadingView />
        </View>
      ) : (
        <ScrollView>
          {listSchedule?.length > 0 ? (
            listSchedule
              ?.sort((a, b) => {
                const [hourStart, minuteStart] = a.startTime.split(":");
                const [hourEnd, minuteEnd] = b.startTime.split(":");
                const timeA = dayjs()
                  .set("hour", parseInt(hourStart))
                  .set("minute", parseInt(minuteStart));
                const timeB = dayjs()
                  .set("hour", parseInt(hourEnd))
                  .set("minute", parseInt(minuteEnd));

                return timeA.valueOf() - timeB.valueOf();
              })
              ?.map((item) => (
                <ScheduleItem
                  key={item.id}
                  item={item}
                  handleAcceptService={handleAcceptSchedule}
                  handleRejectSchedule={handleOpenRejectModal}
                />
              ))
          ) : (
            <View
              style={{
                ...GridStyle.rowItemsVerticalCenter,
                ...MarginStyle.marginT100,
              }}
            >
              <EmptyView />
            </View>
          )}
        </ScrollView>
      )}
      {openRejectSchedule && (
        <ModalRejectSchedule
          open={openRejectSchedule}
          handleCloseModal={handleCloseRejectModal}
          handleConfirmModal={handleRejectSchedule}
        />
      )}
    </View>
  );
};

export default Schedules;
