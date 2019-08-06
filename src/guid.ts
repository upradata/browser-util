// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
const isBrowser = typeof window !== 'undefined';
const random = isBrowser ? crypto.getRandomValues : require('crypto').randomFillSync;

export function guid() {
    return ([ 1e7 ] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ random(new Uint8Array(1))[ 0 ] & 15 >> c / 4).toString(16)
    );
}
