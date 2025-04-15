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

export type weekDays = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';