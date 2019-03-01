
import { PlainObj } from './type';

export type Copy<T> = {
    [ K in keyof T ]: T[ K ];
};


export type AssignMode = 'of' | 'in';
export type ArrayMode = 'merge' | 'replace';

export interface AssignOption {
    assignMode?: AssignMode;
    arrayMode?: ArrayMode;
}

const assignOptionDefault: AssignOption = {
    assignMode: 'of',
    arrayMode: 'merge'
};

class Assign {

    assignRecursive(out: PlainObj, ins: PlainObj[],
        { assignMode = assignOptionDefault.assignMode, arrayMode = assignOptionDefault.arrayMode }: AssignOption = assignOptionDefault) {
        // const { assignMode = assignOptionDefault.assignMode, arrayMode = assignOptionDefault.arrayMode } = assignOption;

        const to = Object(out);

        for (const inn of ins) {
            if (inn === undefined || inn === null)
                continue;

            // for (const prop of Object.keys(inn)) {
            for (const prop in inn) {

                if (assignMode === 'of' && inn.hasOwnProperty(prop) || assignMode === 'in') {
                    // recursion
                    if (typeof inn[ prop ] === 'object' && inn[ prop ] !== null) { // array also
                        if (Array.isArray(inn[ prop ]) && arrayMode === 'replace')
                            to[ prop ] = inn[ prop ];
                        else {
                            const defaultTo = Array.isArray(inn[ prop ]) ? [] : {};
                            to[ prop ] = this.assignRecursive(to[ prop ] || defaultTo, [ inn[ prop ] ], { assignMode, arrayMode });
                        }
                    } else
                        // normal case
                        to[ prop ] = inn[ prop ];
                }
            }
        }

        return to;
    }

}


const assign = new Assign();




export function assignRecursiveArray<T1 extends PlainObj, T2 extends PlainObj>(out: T1, inn: [ T2 ], assignMode?: AssignOption): Copy<T1 & T2>;
export function assignRecursiveArray<T1 extends PlainObj, T2 extends PlainObj,
    T3 extends PlainObj>(out: T1, inn: [ T2, T3 ], assignMode?: AssignOption): Copy<T1 & T2 & T3>;
export function assignRecursiveArray<T1 extends PlainObj, T2 extends PlainObj,
    T3 extends PlainObj, T4 extends PlainObj>(out: T1, inn: [ T2, T3, T4 ], assignMode?: AssignOption): Copy<T1 & T2 & T3 & T4>;
export function assignRecursiveArray<T1 extends PlainObj, T2 extends PlainObj,
    T3 extends PlainObj, T4 extends PlainObj, T5 extends PlainObj>(out: T1, inn: [ T2, T3, T4, T5 ], assignMode?: AssignOption): Copy<T1 & T2 & T3 & T4 & T5>;
export function assignRecursiveArray(out: PlainObj, ins: PlainObj[], assignMode: AssignOption = assignOptionDefault) {

    return assign.assignRecursive(out, ins, assignMode);
}



export function assignRecursive<T1 extends PlainObj, T2 extends PlainObj>(out: T1, inn: T2): Copy<T1 & T2>;
export function assignRecursive<T1 extends PlainObj, T2 extends PlainObj,
    T3 extends PlainObj>(out: T1, inn1: T2, inn2: T3): Copy<T1 & T2 & T3>;
export function assignRecursive<T1 extends PlainObj, T2 extends PlainObj,
    T3 extends PlainObj, T4 extends PlainObj>(out: T1, inn1: T2, inn2: T3, inn3: T4): Copy<T1 & T2 & T3 & T4>;
export function assignRecursive<T1 extends PlainObj, T2 extends PlainObj,
    T3 extends PlainObj, T4 extends PlainObj, T5 extends PlainObj>(out: T1, inn1: T2, inn2: T3, inn3: T4, inn4: T5): Copy<T1 & T2 & T3 & T4 & T5>;
export function assignRecursive(out: PlainObj, ...ins: PlainObj[]) {

    return assign.assignRecursive(out, ins);
}


export function assignRecursiveInArray<T1 extends PlainObj, T2 extends PlainObj>(out: T1, inn: [ T2 ], arrayMode?: ArrayMode): Copy<T1 & T2>;
export function assignRecursiveInArray<T1 extends PlainObj, T2 extends PlainObj,
    T3 extends PlainObj>(out: T1, inn: [ T2, T3 ], arrayMode?: ArrayMode): Copy<T1 & T2 & T3>;
export function assignRecursiveInArray<T1 extends PlainObj, T2 extends PlainObj,
    T3 extends PlainObj, T4 extends PlainObj>(out: T1, inn: [ T2, T3, T4 ], arrayMode?: ArrayMode): Copy<T1 & T2 & T3 & T4>;
export function assignRecursiveInArray<T1 extends PlainObj, T2 extends PlainObj,
    T3 extends PlainObj, T4 extends PlainObj, T5 extends PlainObj>(out: T1, inn: [ T2, T3, T4, T5 ], arrayMode?: ArrayMode): Copy<T1 & T2 & T3 & T4 & T5>;
export function assignRecursiveInArray(out: PlainObj, ins: PlainObj[], arrayMode: ArrayMode = 'merge') {

    return assign.assignRecursive(out, ins, { assignMode: 'in', arrayMode });
}

export function assignRecursiveIn<T1 extends PlainObj, T2 extends PlainObj>(out: T1, inn: T2): Copy<T1 & T2>;
export function assignRecursiveIn<T1 extends PlainObj, T2 extends PlainObj,
    T3 extends PlainObj>(out: T1, inn1: T2, inn2: T3): Copy<T1 & T2 & T3>;
export function assignRecursiveIn<T1 extends PlainObj, T2 extends PlainObj,
    T3 extends PlainObj, T4 extends PlainObj>(out: T1, inn1: T2, inn2: T3, inn3: T4): Copy<T1 & T2 & T3 & T4>;
export function assignRecursiveIn<T1 extends PlainObj, T2 extends PlainObj,
    T3 extends PlainObj, T4 extends PlainObj, T5 extends PlainObj>(out: T1, inn1: T2, inn2: T3, inn3: T4, inn4: T5): Copy<T1 & T2 & T3 & T4 & T5>;
export function assignRecursiveIn(out: PlainObj, ...ins: PlainObj[]) {

    return assign.assignRecursive(out, ins, { assignMode: 'in', arrayMode: 'merge' });
}


export function assignDefaultOption<T extends PlainObj>(defaultOption: Partial<T>, option: T, assignMode: AssignOption = { assignMode: 'in', arrayMode: 'merge' }) {
    // if (typeof option === 'object' || option === undefined)
    return assignRecursiveArray({}, [ defaultOption, option ], assignMode);

    // return option;
}


/* const a = { a: 1, b: 2, c: { c11: 11, c12: 12, c13: { c21: 21, c22: 22 } }, d: 3 };
const b = { b: 3, c: { c11: 50, c13: { c22: 100 } } };
const a0 = { b: 2 };
console.log(assignRecursive(a0, a, b)); */
