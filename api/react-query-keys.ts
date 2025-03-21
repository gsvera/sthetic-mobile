export const REACT_QUERY_KEYS = {
    user: {
        findDuplicatedUser: (key:string) => `get-plan-filter-data-${key}`,
        getDataUser: (key: string) => `get-data-user-${key}`,
    },
    userConfig: {
        getLocationByUser: (key:string) => `get-location-by-user${key}`
    },
    plan: {
        getFilterData: (key:string) => `get-plan-filter-data-${key}`
    },
    lada: {
        getFilterData: (key:string) => `get-lada-filter-data-${key}`
    },
    catalogs: {
        typeServices: {
            getByUser: (key: string) => `get-catalogs-type-by-user-${key}`,
            getAll: (key:string) => `get-all-catalogs-type-services-${key}`
        }
    }
}