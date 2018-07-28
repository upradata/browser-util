export * from 'ts-util-is';


// MDN Polyfill
export function isInt(n: number) {
    return typeof n === 'number' &&
        isFinite(n) &&
        Math.floor(n) === n;
}



export function isFloat(n: number) {
    return !isInt(n);
}

export function isNil(value: any) {
    return value === null || value === undefined;
}

export function isAsyncFunction(value: any) {
    return Object.prototype.toString.call(value) === '[object AsyncFunction]';
}
