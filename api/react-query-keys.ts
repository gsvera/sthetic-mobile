export const REACT_QUERY_KEYS = {
    user: {
        findDuplicatedUser: (key:string) => `get-plan-filter-data-${key}`,
        getDataUser: (key: string) => `get-data-user-${key}`,
    },
    plan: {
        getFilterData: (key:string) => `get-plan-filter-data-${key}`
    },
    lada: {
        getFilterData: (key:string) => `get-lada-filter-data-${key}`
    }
}