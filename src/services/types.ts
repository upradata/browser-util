export type Service<BaseService = any> = BaseService | any;


export type Services<T = { [ k: string ]: any; }> = {
    [ key in keyof T ]: Service;
};


export interface LoadServices<S extends Services> {
    (configuration?: Partial<ServicesConfig<S>>): Promise<Partial<S>>;
}

export interface LoadServicesModule<S extends Services> {
    loadServices: LoadServices<S>;
}


export interface ServiceConfig<C = any, S extends Services = Services> {
    path?: string;
    loadServicesModule?: LoadServicesModule<S> | Promise<LoadServicesModule<S>>;
    config?: C;
}

export class ServicesConfig<Services> {
    services: Partial<Record<keyof Services, ServiceConfig>>;
    windowGlobal: string;
    include: Partial<Record<keyof Services, boolean>>;
    exclude: Partial<Record<keyof Services, boolean>>;
    dispatchEvents: boolean = true;
    servicesLoadedEventName: string = '__services-loaded__';
    serviceLoadedEventName: (name: string) => string = name => `__services-loaded__/${name}`;
};
