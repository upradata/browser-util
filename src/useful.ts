export * from './assign';
export * from './is';


// chain(() => o.a.b.c) ==> if a prop doesn't exist ==> return defaultValue
export function chain<T>(exp: () => T, defaultValue: T = undefined) {
    try {
        /* const val = exp();
        if (val != null) {
            return val;
        } */
        return exp();
    } catch (e) {
        if (!(e instanceof ReferenceError || e instanceof TypeError))
            throw e;
    }
    return defaultValue;
}
