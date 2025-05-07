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
    companyPicture?: string;
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

export type weekDays = 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes' | 'sábado' | 'domingo';