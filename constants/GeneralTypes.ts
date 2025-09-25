import { STATUS_SERVICE } from "./Constants";

export type loginData = {
    username: string;
    password: string;
    isProvider?: boolean;
}

export type selectOptionType = {
    key: number | string,
    value: string,
    descriptionEs?: string,
    checked?: boolean
}

export type fileTypes = 'image' | 'video' | null;

export type modalCustomProps = {
    open: boolean;
    handleCloseModal: () => void;    
    idUser?: string;
  };
  export type modalActionCustomProps = {
    open: boolean;
    handleCloseModal: () => void;    
    handleConfirmModal: (text?: string) => void;
  };

export type CatalogGeoStateType = {
    id: number;
    stateName: string;
}

export type CatalogGeoMunicipalityType = {
    id: number;
    municipalityName: string;
    latitude: number;
    longitude: number;
}
export type OptionSelectType = {
    value: string | number;
    label: string;
    onSelect: (value:string | number) => void   
}

/**
 *  OBJECTS
 */

export type LadaType = {
    id: number;
    code: string;
    lada: string;
}

export type CatalogPlanDTO = {
    id: number;
    active: boolean;
    name: string;
    duration: number;
    price: number;
}

export type UserPlan = {
    id: number;
    idUser: string;
    createdData: string;
    duration: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    catalogPlanDTO: CatalogPlanDTO;
}

export type InfoCompanyType = {
    id: number;
    idUser: string;
    generalDescription: string;
    companyName: string;
    companyPictureUrl?: string;
    facebook?: string;
    instagram?: string;
    webPage?: string;
}

export type CatalogService = {
    id: number;
    idUser: string;
    nameService: string;
    price: number;
    people: number
}

export type ScheduleTypeUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    lada: string;
    phone: string;
}

export type ScheduleType = {
    id: number;
    idClient: ScheduleTypeUser;
    idProvider: string;
    scheduleDate: string;
    startTime: string;
    endTime: string;
    nameService: string;
    people: number;
    amount: number;
    statusService: number;
    comments?: string;
}

export type DataChangeStatusSchedule = {
    idSchedule: number;
    statusSchedule: number;
    textComments?: string;
}
export type StatusScheduleType = STATUS_SERVICE | undefined;


export type weekDays = 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes' | 'sábado' | 'domingo';

export type TrainingType = {
    id: number;
    orderShow: number;
    nameVideo: string;
    description?: string;
    linkVideo: string;
}

export type ObjPayType = {
  nameProduct: string;
  amount: number;
  nameCustomer: string;
  emailCustomer: string;
};

export type StripeDataCustomerType = {
    customerStripe: string,
    ephemeralKeyStripe: string,
    paymentIntentStripe: string,
}