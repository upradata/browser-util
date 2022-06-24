import { dispatchCustomEvent } from '../custom-events';
import { LoadModuleServices, ModulesServices, ModulesServicesConfiguration, ModulesServicesConfig, DefaultModuleServices } from './types';
// import { ReplaySubject, Observable } from 'rxjs'; // ====> A pity to add rxjs dependency. Promise is enough
import { entries, assignRecursive, AssignOptions, TT$, isPromise, delayedPromise } from '@upradata/util';

type Services = any;

// const loaded$ = new ReplaySubject<Services>(1);

const servicesPromise = delayedPromise<Services>();
// new Promise<Services>((res, _rej) => resolve = res);

export const servicesLoaded$ = <Services>(): Promise<Services> => servicesPromise.promise;
// export const servicesObs$ = <Services>(): Observable<Services> => loaded$.asObservable();

interface ServicesLoaded<S> {
    name: string;
    services: DefaultModuleServices<S>;
}


export function loadServices<M extends ModulesServices<S>, S = any>(modulesServicesConfig?: ModulesServicesConfig<M>): TT$<Partial<M>> {

    const modulesConfig: ModulesServicesConfiguration<M> = assignRecursive(
        new ModulesServicesConfiguration<M>(),
        modulesServicesConfig,
        new AssignOptions({ arrayMode: 'replace' })
    );


    const {
        windowGlobal, variable, include, exclude, dispatchEvents,
        servicesLoadedEventName, serviceLoadedEventName, beforeDispatchEvents
    } = modulesConfig;

    const services = {};

    const loadedServices: TT$<ServicesLoaded<S>>[] = [];

    const addService = (name: string, config: any, module: TT$<LoadModuleServices<any, DefaultModuleServices<any>>>) => {
        const loaded = Promise.resolve(module).then(m => m.loadServices(config)).then(services => ({ name, services }));
        loadedServices.push(loaded);
    };

    for (const [ name, serviceConfig ] of entries(modulesServicesConfig.config)) {
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

        const variables = variable ? [ variable ] : [];

        if (windowGlobal) {
            const global = window[ windowGlobal ] = window[ windowGlobal ] || {} as any;
            global.services = global.services || {} as any;

            variables.push(global.services);
        }


        for (const variable of variables.filter(v => !!v)) {
            Object.assign(variable, services);
        }

        if (windowGlobal)
            window[ windowGlobal ].loaded = true;

        beforeDispatchEvents();

        if (dispatchEvents)
            dispatchCustomEvent(servicesLoadedEventName, { detail: services });

        servicesPromise.resolve(services);
        // loaded$.next(services);

        return services;
    };

    const returnPromise = loadedServices.some(isPromise);

    return returnPromise ? Promise.all(loadedServices).then(handleServicesLoaded) : handleServicesLoaded(loadedServices as ServicesLoaded<S>[]);
}
