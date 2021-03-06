export const getUnixTime =  (date: Date) => date.getTime() / 1000

export const getUnixTimeGMT =  (date: Date) => date.getTime() / 1000 - date.getTimezoneOffset() * 60

export const getDateOnly = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const getFirstOfYear = (date: Date) => new Date(date.getFullYear(), 0, 1)

export const getIsoString = (date: Date) => (new Date(getUnixTimeGMT(date) * 1000)).toISOString().slice(0, -1)