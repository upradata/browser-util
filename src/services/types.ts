// export type Service<BaseService = any> = BaseService | any;


/* export type ModuleServices<T = { [ k: string ]: any; }> = {
    [ key in keyof T ]: Service;
}; */

export interface ModuleServices<Service> {
    [ key: string ]: Service;
}

export interface LoadServices<C, M extends ModuleServices<S>, S = any> {
    (configuration?: C): Promise<M>;
}

export interface LoadModuleServices<C, M extends ModuleServices<any>, S = any> {
    loadServices: LoadServices<C, M, S>;
}


export interface ModuleServicesConfig<M extends ModuleServices<any> = ModuleServices<any>, C = any, S = any> {
    // path?: string; => import(path) will not work with webpack. It does not know what is path during building
    module?: LoadModuleServices<C, M, S> | Promise<LoadModuleServices<C, M, S>>;
    config?: C;
}

export interface ModulesServices<Service> {
    [ module: string ]: ModuleServices<Service>;
}

export class ModulesServicesConfig<Modules extends ModulesServices<Service>, Service = any> {
    modulesServices: Partial<Record<keyof Modules, ModuleServicesConfig>>;
    windowGlobal: string;
    include: Partial<Record<keyof Modules, boolean>>;
    exclude: Partial<Record<keyof Modules, boolean>>;
    dispatchEvents: boolean = true;
    servicesLoadedEventName: string = '__services-loaded__';
    serviceLoadedEventName: (name: string) => string = name => `__services-loaded__/${name}`;
}
