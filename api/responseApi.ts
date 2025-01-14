
type ObjectResponse = {
    error: boolean;
    items: object[] | any;
    message: string;
}

type ResponseAPi = {
    data: ObjectResponse    
}

type ResponseManualApi = {
    data: ResponseAPi
}