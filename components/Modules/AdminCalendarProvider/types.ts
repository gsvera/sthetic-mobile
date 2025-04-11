export type weekDaysProps = {
    day: string;
    isActive: boolean;
    startTime: string;
    endTime: string;
    duration: number; // minutos
    maxReservations: number;
    dateString?: string;
};

export type exceptionDayType = weekDaysProps & {
    id: number;
    idUser: string;
    comments: string;
};

export type AvailableByDay = {
    [date: string]: {
      horarios: weekDaysProps[];
    };
};

export type availableTimeProps = {
    selectedDate: string;
    handleSave: (selectedDate: string, times: weekDaysProps[]) => void; 
};
