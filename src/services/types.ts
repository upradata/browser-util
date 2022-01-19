import { TT$ } from '@upradata/util';
// export type Service<BaseService = any> = BaseService | any;


/* export type ModuleServices<T = { [ k: string ]: any; }> = {
    [ key in keyof T ]: Service;
}; */

type DefaultModuleServices<Service> = {
    [ serviceName: string ]: Service;
};

export type ModuleServices<Service, Services extends Record<PropertyKey, Service> = DefaultModuleServices<Service>> = Services;

export type LoadServices<C, M extends ModuleServices<any>> = M extends ModuleServices<infer S> ? {
    (configuration?: C): TT$<M>;
} : never;

export interface LoadModuleServices<C, M extends ModuleServices<any>> {
    loadServices: LoadServices<C, M>;
}


export type ModuleServicesConfig<M extends ModuleServices<any> = ModuleServices<any>, C = any> = M extends ModuleServices<infer S> ? {
    // path?: string; => import(path) will not work with webpack. It does not know what is path during building
    module?: TT$<LoadModuleServices<C, M>>;
    config?: C;
} : never;

export type ModulesServices<Service, ModuleNames extends string = string> = {
    [ module in ModuleNames ]: ModuleServices<Service>;
};


export class ModulesServicesConfig<Modules extends ModulesServices<Service>, Service = any> {
    modulesServices: Partial<Record<keyof Modules, ModuleServicesConfig>>;
    windowGlobal: string;
    variable: object;
    include: Partial<Record<keyof Modules, boolean>>;
    exclude: Partial<Record<keyof Modules, boolean>>;
    dispatchEvents: boolean = true;
    beforeDispatchEvents: () => any = () => { };
    servicesLoadedEventName: string = '__services-loaded__';
    serviceLoadedEventName: (name: string) => string = name => `__services-loaded__/${name}`;
}


export type ModulesServicesOpts<Modules extends ModulesServices<Service>, Service = any> = Partial<ModulesServicesConfig<Modules, Service>>;
