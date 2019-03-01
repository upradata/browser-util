import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PlainObj } from './type';


export class ExecuteOnTempState {
    private oldState: PlainObj;
    private obj: PlainObj;
    private tmpState: PlainObj;

    constructor() { }

    backAndReturn<Return>(ret: Return) {
        Object.assign(this.obj, this.oldState);
        return ret;
    }


    state<State>(state: { obj: State, tmpState: Partial<State> }) {
        Object.assign(this, state);
        return this;
    }

    execute<R>(syncOrAsyncAction: () => R): R {
        this.oldState = {} as any;

        for (const k of Object.keys(this.tmpState))
            this.oldState[ k ] = this.obj[ k ];

        Object.assign(this.obj, this.tmpState);

        /// start ///
        const r = syncOrAsyncAction.call(this.obj);

        if (r instanceof Promise)
            return (r as Promise<any>).then(ret => this.backAndReturn(ret)) as any as R;

        if (r instanceof Observable)
            return (r as Observable<any>).pipe(tap(ret => this.backAndReturn(ret))) as any as R;

        return this.backAndReturn(r);
    }
}


/* const o = {
    a: 1,
    b: 2,
    c: 3
};

const oo = new ExecuteOnTempState().state({ obj: o, tmpState: { b: 22, c: 33 } }).execute(function () {
    console.log(o);
    console.log(this);

    return Promise.resolve(o);
});
 */
