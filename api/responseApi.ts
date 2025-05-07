
export type ObjectResponse = {
    error: boolean;
    items: object[] | any;
    message: string;
}

export type ResponseApi = {
    data: ObjectResponse    
}

type ResponseManualApi = {
    data: ResponseApi
}