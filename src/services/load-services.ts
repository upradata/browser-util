import { dispatchCustomEvent } from '../custom-events';
import { LoadModuleServices, ModulesServices, ModulesServicesConfig } from './types';
// import { ReplaySubject, Observable } from 'rxjs'; // ====> A pity to add rxjs dependency. Promise is enough
import { entries, ObjectOf, assignRecursive, AssignOptions, Function1, TT$, isPromise } from '@upradata/util';

type Services = any;

let resolve: Function1<Services> = undefined;
// const loaded$ = new ReplaySubject<Services>(1);

const servicesPromise = new Promise<Services>((res, _rej) => resolve = res);

export const servicesPromise$ = <Services>(): Promise<Services> => servicesPromise;
// export const servicesObs$ = <Services>(): Observable<Services> => loaded$.asObservable();

interface ServicesLoaded<S> {
    name: string;
    services: ObjectOf<S>;
}

export function loadServices<M extends ModulesServices<S>, S = any>(modulesServicesConfig?: Partial<ModulesServicesConfig<M, S>>): TT$<Partial<M>> {

    const { windowGlobal, variable, include, exclude, dispatchEvents, servicesLoadedEventName, serviceLoadedEventName, beforeDispatchEvents } =
        assignRecursive(new ModulesServicesConfig(), modulesServicesConfig, new AssignOptions({ arrayMode: 'replace' }));

    const services = {};

    const loadedPromises: TT$<ServicesLoaded<S>>[] = [];

    const addService = (name: string, config: any, module: TT$<LoadModuleServices<any, ObjectOf<S>, S>>) => {
        if (isPromise(module)) {
            const loaded = module.then(m => m.loadServices(config)).then(services => ({ name, services }));
            loadedPromises.push(loaded);
        } else {
            const loaded = module.loadServices(config);
            if (isPromise(loaded))
                loadedPromises.push(loaded.then(services => ({ name, services })));
            else
                loadedPromises.push({ name, services: loaded });
        }
    };

    for (const [ name, serviceConfig ] of entries(modulesServicesConfig.modulesServices)) {
        if (exclude && exclude[ name ])
            continue;

        if (!include || include[ name ])
            addService(name as string, serviceConfig.config, serviceConfig.module /* || import(serviceConfig.path) */);
    }

    const handleServicesLoaded = (servicesLoaded: ServicesLoaded<S>[]): Partial<M> => {
        for (const { name, services: s } of servicesLoaded) {
            services[ name ] = s;

            if (dispatchEvents)
                dispatchCustomEvent(serviceLoadedEventName(name), { detail: s });
        }

        const variables = [ variable ];

        if (windowGlobal) {
            const global = window[ windowGlobal ] = window[ windowGlobal ] || {} as any;
            global.services = global.services || {} as any;

            variables.push(global.services);
        }


        for (const variable of variables.filter(v => !!v)) {
            for (const [ k, v ] of Object.entries(services))
                variable[ k ] = v;
        }

        if (windowGlobal)
            window[ windowGlobal ].loaded = true;

        beforeDispatchEvents();

        if (dispatchEvents)
            dispatchCustomEvent(servicesLoadedEventName, { detail: services });

        resolve(services);
        // loaded$.next(services);

        return services;
    };

    const returnPromise = loadedPromises.some(isPromise);

    return returnPromise ? Promise.all(loadedPromises).then(handleServicesLoaded) : handleServicesLoaded(loadedPromises as ServicesLoaded<S>[]);
}
