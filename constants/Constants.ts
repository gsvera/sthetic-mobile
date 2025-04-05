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
    MY_LOCATION = 'myLocation',
    PROFILE_PICTURE = 'profilePicture',
    TYPE_SERVICES = 'typeServices',
    SERVICES_CATALOG = 'servicesCatalog',
    MY_SUBSCRIPTION = 'mySupscription'
}

export enum TYPE_STATUS {
    UPDATE = 'update',
    SUCCESS = 'success',
    ERROR = 'error'
}

export enum MAX_LENGTH {
    MAX_FILE_TO_UPLOAD = 5
}