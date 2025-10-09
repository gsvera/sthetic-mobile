export const REACT_QUERY_KEYS = {
    user: {
        findDuplicatedUser: (key:string) => `get-plan-filter-data-${key}`,
        getDataUser: (key: string) => `get-data-user-${key}`,
    },
    schedule: {
        getAllByDay: (key: string) => `schedule-get-all-${key}`,
        getTempClients: (key: string | undefined) => `schedule-get-temp-clients-${key}`
    },
    userConfig: {
        getLocationByUser: (key:string) => `get-location-by-user${key}`,
        getInfoCompanyByUer: (key:string) => `get-info-company-by-user-${key}`,
        getTraining: (key: string) => `get-training-${key}`,
        configVersion: (key:string) => `get-current-version-${key}`
    },
    plan: {
        getFilterData: (key:string) => `get-plan-filter-data-${key}`,
        getByUser:(key:string) => `get-plan-by-user`
    },
    lada: {
        getFilterData: (key:string) => `get-lada-filter-data-${key}`
    },
    catalogs: {
        typeServices: {
            getByUser: (key: string) => `get-catalogs-type-by-user-${key}`,
            getAll: (key:string) => `get-all-catalogs-type-services-${key}`
        },
        services: {
            getByUserId: (key:string) => `get-catalog-user-service-by-id-${key}`,
            getToEdit: (key:number) => `get-catalog-user-service-to-edit-${key}`
        },
        coupon: {
            getByCode: (key:string) => `get-coupon-by-code-${key}`
        },  
        geo: {
            getAllState: (key: string) => `get-all-geo-state-${key}`,
            getMunicipalityByState: (key: number | undefined) => `get-all-geo-municipality-${key}`
        }      
    },
    menuServices: {
        getServiceById: (key: number | undefined) => `get-menu-service-by-id-${key}`,
        getByUserId: (key: string | undefined) => `get-menu-services-by-user-id-${key}`
    },
    calendar: {
        calendarByUser: {
            getByIdUser: (key:string | undefined) => `get-calendar-by-user-id-${key}`,
            getTimeCalendarByProvider:(key: string) => `get-calendar-available-by-provider-${key}`
        },
        calendarException: {
            getByUser: (key:string) => `get-calendar-exception-by-user-${key}`
        },
        
    },
    payment: {
        validStatusPay: (key: string) => `get-status-pay-${key}`,
        getClientIdStripe: (key:string) => `get-client-id-strip-${key}` 
    },
    provider: {
        getServicesByProvider: (key: string | undefined) => `get-service-by-provider-${key}`
    }
}