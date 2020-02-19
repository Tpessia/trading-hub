export default interface Dictionary<T> {
    [key: string]: T
}

export type EnumDictionary<T extends string | symbol | number, U> = {
    [K in T]?: U
}

export type StrictEnumDictionary<T extends string | symbol | number, U> = {
    [K in T]: U
}