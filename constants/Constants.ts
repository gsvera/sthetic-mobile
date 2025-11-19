import { weekDays } from "./GeneralTypes";

export const VERSION_ANDROID = "v1.0.17";
export const VERSION_IOS = "v1.0.17";
export const APP_NAME_SLUG = 'meredith-aesthetic-work';
export const PACKAGE_NAME_ANDROID = "com.abasotech.meredithcarework";
export const APP_STORE_ID = "6754846887";

export const imageBg = require("@/assets/images/background.webp");

export enum ROUTES {
    LOGIN = 'login'
} ;

export const REGEX = {
    ONLY_TEXT: /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/ ,
    ONLY_NUMBER: /^\d+$/ ,  
    ONLY_NUMBER_PRICE: /^[+-]?(\d+([.,]\d*)?|[.,]\d+)$/ ,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/ ,
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
}

export enum COMPONENTS_SETINGS {
    PERSONAL_INFORMATION = 'personalInformation',
    CHANGE_PASSWORD = 'changePassword',
    MY_LOCATION = 'myLocation',
    PROFILE_PICTURE = 'profilePicture',
    TYPE_SERVICES = 'typeServices',
    SERVICES_CATALOG = 'servicesCatalog',
    PORFTOLIO_SERVICES = 'portfolioServices',
    MY_SUBSCRIPTION = 'mySupscription',
    MY_COMPANY = 'myCompany',
    TRAINING = 'training'
}

export enum TYPE_STATUS {
    UPDATE = 'update',
    SUCCESS = 'success',
    ERROR = 'error'
}

export enum MAX_LENGTH {
    MAX_FILE_TO_UPLOAD = 5
}

export enum FORMAT_DATE {
    GENERAL_EN = "YYYY-MM-DD",
    TIME_STAMP = 'YYYY-MM-DDTHH:mm:ss'
}

export const WEEK_DAYS:weekDays[] = [
    'lunes',
    'martes', 
    'miércoles', 
    'jueves', 
    'viernes', 
    'sábado', 
    'domingo'
];

export const DEFAULT_VALUES_WEEK = WEEK_DAYS.map((day: string) => ({
  day,
  isActive: false,
  startTime: "",
  endTime: "",
  duration: 0,
  maxReservations: 0,
}));

export enum STATUS_SERVICE {
    REJECT = -1,
    PENDIENT = 0,
    ACCEPT = 1,
    CANCEL = 2,
    NOPRESENT = 3,
    FINALIZED = 4
}

export enum PLATFORM_TYPE {
    IOS = 'ios',
    ANDROID = 'android'
}

export enum STATUS_ACCOUNT_PAY  {
        OVERDUE_ACCOUNT = 'Cuenta vencida',
        CURRENT_ACCOUNT = 'Cuenta al corriente'
}

export enum PAYMENT_TYPE {
    FREE = 'Free coupon',
    STRIPE = 'Stripe'
}