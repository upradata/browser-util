# @mt/browser-util
Browser Utilities

## A bunch of utilities in typescript working on Browser (ans so on Node)

- assignRecursive, assignDefaultOption
  
```
const a = {
     a: 1,
     b: 2,
     c: { c11: 11, c12: 12, c13: { c21: 21, c22: 22 } },
     d: 3
};
const b = { b: 3, c: { c11: 50, c13: { c22: 100 } } };
const a0 = { b: 2 };

const o1 = assignRecursive(a0, a, b);
console.assert(o1 === a0);

const o2 = assignDefaultOption({a:1, b:2}, b);
```

- chain (enabling kind of syntax a?b?c?d) ==> if a prop doesn't exist ==> return defaultValue
```
const defaultValue = 'whatever optional value';
chain(() => a.b.c.d, defaultValue);
```

- types: PartialRecursive, ObjectOf/PlainObj
- is utilities (isArray, isDefined, isInt, isAsyncFunction, ...)
- guid generator

- ExecuteOnTempState (change and object property temporarly)
 ```
 const o = {
    a: 1,
    b: 2,
    c: 3
};

const oo = new ExecuteOnTempState().state({ obj: o, tmpState: { b: 22, c: 33 } }).execute(function () {
    console.log(o);
    console.log(this);

    return Promise.resolve(o);
});
```

- EventWrapperInRaf (wrap an event inside a requestAnimationFrame)
```
    const elementTarget = window;
    const eventName = 'scroll';
    const newEventName = eventName + 'InRaf';

    const scrollEvent: EventWrapperParam = {
        elementTarget, // this.el.nativeElement,
        source: {
            eventName,
            options: {} as boolean | AddEventListenerOptions
        },
        destination: {
            eventName: newEventName,
            debug: newEventName,
            getDetail: () => ({ ledetaildeouf: 'cool:)' })
        }
    };

    EventWrapperInRaf.create(scrollEvent);

    window.addEventListener(newEventName, event => console.log(event));
```

- BooleanAttribute.getBoolean (returns a boolean value for a html boolean attribute)

```
@Input() set right(right: string | boolean) {
        this.toRight = BooleanAttribute.getBoolean(right);
    }
```
