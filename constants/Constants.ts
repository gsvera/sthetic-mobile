export enum ROUTES {
    LOGIN = 'login'
} ;

export const REGEX = {
    ONLY_TEXT: /^[a-zA-Z\s]+$/ ,
    ONLY_NUMBER: /^\d+$/ ,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
}

export enum COMPONENTS_SETINGS {
    PERSONAL_INFORMATION = 'personalInformation',
    CHANGE_PASSWORD = 'changePassword',
    MY_LOCATION = 'myLocation'
}

export enum TYPE_STATUS {
    UPDATE = 'update',
    SUCCESS = 'success',
    ERROR = 'error'
}