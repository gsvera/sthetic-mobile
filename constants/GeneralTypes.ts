export type loginData = {
    username: string;
    password: string;
}

export type selectOptionType = {
    key: number | string,
    value: string,
    checked?: boolean
}

export type fileTypes = 'image' | 'video' | null;


/**
 *  OBJECTS
 */

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
