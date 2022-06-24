import { TT$ } from '@upradata/util';
// export type Service<BaseService = any> = BaseService | any;


/* export type ModuleServices<T = { [ k: string ]: any; }> = {
    [ key in keyof T ]: Service;
}; */

export type DefaultModuleServices<Service> = {
    [ serviceName: string ]: Service;
};

export type ModuleServices<Service, Services extends Record<PropertyKey, Service> = DefaultModuleServices<Service>> = Services;

export type LoadServices<C, M extends ModuleServices<any>> = M extends ModuleServices<any> ? {
    (configuration?: C): TT$<M>;
} : never;


export interface LoadModuleServices<C, M extends ModuleServices<any>> {
    loadServices: LoadServices<C, M>;
}


export type ModuleServicesConfig<M extends ModuleServices<any> = ModuleServices<any>, C = any> = M extends ModuleServices<any> ? {
    // path?: string; => import(path) will not work with webpack. It does not know what is path during building
    module?: TT$<LoadModuleServices<C, M>>;
    config?: C;
} : never;


export type ModulesServices<Services extends ModuleServices<any, any>> = Services;

export type DefaultModulesOptions<Modules extends ModulesServices<any>> = Partial<Record<keyof Modules, any>>;

export type ModulesServicesConfOptions<Modules extends ModulesServices<any>, ModulesOptions extends DefaultModulesOptions<Modules>> = {
    [ moduleNames in keyof Modules & keyof ModulesOptions ]: ModuleServicesConfig<Modules[ moduleNames ], ModulesOptions[ moduleNames ]>
};


export class ModulesServicesConfiguration<
    Modules extends ModulesServices<any>,
    ModulesConfOptions extends ModulesServicesConfOptions<Modules, any> = ModulesServicesConfOptions<Modules, any>
    > {
    config: Partial<ModulesConfOptions>;
    windowGlobal: string;
    variable: object;
    include: Partial<Record<keyof Modules, boolean>>;
    exclude: Partial<Record<keyof Modules, boolean>>;
    dispatchEvents: boolean = true;
    beforeDispatchEvents: () => any = () => { };
    servicesLoadedEventName: string = '__services-loaded__';
    serviceLoadedEventName: (name: string) => string = name => `__services-loaded__/${name}`;
}


export type ModulesServicesConfig<
    Modules extends ModulesServices<any>,
    ModulesOptions extends ModulesServicesConfOptions<Modules, any> = Record<keyof Modules, any>
    > = Partial<ModulesServicesConfiguration<Modules, ModulesOptions>>;
