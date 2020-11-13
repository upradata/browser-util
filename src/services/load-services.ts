import { dispatchCustomEvent } from '../custom-events';
import { LoadModuleServices, ModulesServices, ModulesServicesConfig } from './types';
import { ReplaySubject, Observable } from 'rxjs';
import { entries, ObjectOf, assignRecursive, AssignOptions, Function1 } from '@upradata/util';

type Services = any;

let resolve: Function1<Services> = undefined;
const loaded$ = new ReplaySubject<Services>(1);

const servicesPromise = new Promise<Services>((res, _rej) => resolve = res);

export const servicesPromise$ = <Services>(): Promise<Services> => servicesPromise;
export const servicesObs$ = <Services>(): Observable<Services> => loaded$.asObservable();



export async function loadServices<M extends ModulesServices<S>, S = any>(modulesServicesConfig?: Partial<ModulesServicesConfig<M, S>>): Promise<Partial<M>> {

    const { windowGlobal, include, exclude, dispatchEvents, servicesLoadedEventName, serviceLoadedEventName } =
        assignRecursive(new ModulesServicesConfig(), modulesServicesConfig, new AssignOptions({ arrayMode: 'replace' }));

    const services = {};

    const loadedPromises: Promise<{ name: string; services: ObjectOf<S>; }>[] = [];

    const addService = async (name: string, config: any, module$: Promise<LoadModuleServices<any, ObjectOf<S>, S>>) => {
        const loaded = module$.then(m => m.loadServices(config)).then(services => ({ name, services }));
        loadedPromises.push(loaded);
    };

    for (const [ name, serviceConfig ] of entries(modulesServicesConfig.modulesServices)) {
        if (exclude && exclude[ name ])
            continue;

        if (!include || include[ name ])
            addService(name as string, serviceConfig.config, Promise.resolve(serviceConfig.module) /* || import(serviceConfig.path) */);
    }

    const servicesLoaded = await Promise.all(loadedPromises);

    for (const { name, services: s } of servicesLoaded) {
        services[ name ] = s;

        if (dispatchEvents)
            dispatchCustomEvent(serviceLoadedEventName(name), { detail: s });
    }


    if (windowGlobal) {
        const global = window[ windowGlobal ] = window[ windowGlobal ] || {} as any;
        global.services = global.services || {} as any;

        for (const [ k, v ] of Object.entries(services))
            global.services[ k ] = v;
    }


    if (dispatchEvents)
        dispatchCustomEvent(servicesLoadedEventName, { detail: services });

    resolve(services);
    loaded$.next(services);

    return services;
}
