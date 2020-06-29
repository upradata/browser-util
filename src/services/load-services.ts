import { dispatchCustomEvent } from '../custom-events';
import { Service, LoadServicesModule, Services, ServicesConfig } from './types';
import { entries, ObjectOf, assignRecursive, AssignOptions, Function1 } from '@upradata/util';


export async function loadServices<S extends Services>(servicesConfig?: Partial<ServicesConfig<S>>): Promise<Partial<S>> {

    const { windowGlobal, include, exclude, dispatchEvents, servicesLoadedEventName, serviceLoadedEventName } =
        assignRecursive(new ServicesConfig(), servicesConfig, new AssignOptions({ arrayMode: 'replace' }));

    const services = {};

    const loadedPromises: Promise<{ name: string; services: ObjectOf<Service>; }>[] = [];

    const addService = async (name: string, config: any, module$: Promise<LoadServicesModule<ObjectOf<Service>>>) => {
        const loaded = module$.then(m => m.loadServices(config)).then(services => ({ name, services }));
        loadedPromises.push(loaded);
    };

    for (const [ name, serviceConfig ] of entries(servicesConfig.services)) {
        if (exclude && exclude[ name ])
            continue;

        if (!include || include[ name ])
            addService(name as string, serviceConfig.config, Promise.resolve(serviceConfig.loadServicesModule) || import(serviceConfig.path));
    }

    const servicesLoaded = await Promise.all(loadedPromises);

    for (const { name, services: s } of servicesLoaded) {
        services[ name ] = s;

        if (dispatchEvents)
            dispatchCustomEvent(serviceLoadedEventName(name));
    }


    if (windowGlobal) {
        const global = window[ windowGlobal ] = window[ windowGlobal ] || {} as any;
        global.services = {} as any;

        for (const [ k, v ] of Object.entries(services))
            global.services[ k ] = v;
    }


    if (dispatchEvents)
        dispatchCustomEvent(servicesLoadedEventName);

    return services;
};
