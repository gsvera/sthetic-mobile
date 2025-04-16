export const REACT_QUERY_KEYS = {
    user: {
        findDuplicatedUser: (key:string) => `get-plan-filter-data-${key}`,
        getDataUser: (key: string) => `get-data-user-${key}`,
    },
    userConfig: {
        getLocationByUser: (key:string) => `get-location-by-user${key}`,
        getInfoCompanyByUer: (key:string) => `get-info-company-by-user-${key}`
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
        }
    },
    calendar: {
        calendarByUser: {
            getByIdUser: (key:string | undefined) => `get-calendar-by-user-id-${key}`
        },
        calendarException: {
            getByUser: (key:string) => `get-calendar-exception-by-user-${key}`
        }
    }
}