module Resource {
    export interface IServerCallResource<T> extends ng.resource.IResourceClass<any> {
        update(data: Object, success: Function, error?: Function): T;
    }

    export interface IServerCall {
        Person: IServerCallResource<any>;
        Account: ng.resource.IResourceClass<any>;
        PersonService: ng.resource.IResourceClass<any>;
        Service: ng.resource.IResourceClass<any>;
        Communication: ng.resource.IResourceClass<any>
    }
    export class ServerCall implements IServerCall {
        public Person: IServerCallResource<any>;
        public Account: ng.resource.IResourceClass<any>;
        public PersonService: ng.resource.IResourceClass<any>;
        public Service: ng.resource.IResourceClass<any>;
        public Communication: ng.resource.IResourceClass<any>
        constructor($resource: ng.resource.IResourceService) {
            var updateDescriptor: ng.resource.IActionDescriptor = { method: "PUT"};

            this.Person = <IServerCallResource<any>>$resource('/api/person/:id', { id: '@id' }, { update: updateDescriptor});
            this.Account = $resource('/api/account/:id', { id: '@id' });
            this.PersonService = $resource('/api/personservices/:id', { id: '@id' });
            this.Service = $resource('/api/services/:id', { id: '@id' });
            this.Communication = $resource('/api/comunication/:id', { id: '@id' });
        }
    }

}  