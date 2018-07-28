export interface PlainObj<T = any> {
    [k: string]: T;
}



export type PartialRecursive<T> = PartialRec<T>;

type isArray<T> = T extends (infer U)[] ? true : false;

type PartialRec<T> = {
    [K in keyof T]?: isArray<T[K]> extends true ? T[K] : PartialRecursive<T[K]>;
};
