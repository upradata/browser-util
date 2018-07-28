export * from './assign';


export function chain<T>(exp: () => T, defaultValue: T = undefined) {
    try {
        const val = exp();
        if (val != null) {
            return val;
        }
    } catch (e) {
        if (!(e instanceof ReferenceError || e instanceof TypeError))
            throw e;
    }
    return defaultValue;
}
