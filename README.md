# @upradata/browser-util

Browser Utilities

## A bunch of utilities in typescript working on Browser

Look at [Node Utilities](https://www.npmjs.com/package/@upradata/browser-util), for util stuff working only on Node

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

    // A cache creating to not create few time the same wrapper.
```
