module Resource {
    export interface IServerCallResource<T> extends ng.resource.IResourceClass<any> {
        update(data: Object, success: Function, error?: Function): T;
    }

    export interface IServerCall {
        Person: IServerCallResource<any>;
        Account: ng.resource.IResourceClass<any>;
    }
    export class ServerCall implements IServerCall {
        public Person: IServerCallResource<any>;
        public Account: ng.resource.IResourceClass<any>;
        constructor($resource: ng.resource.IResourceService) {
            var updateDescriptor: ng.resource.IActionDescriptor = { method: "PUT"};

            this.Person = <IServerCallResource<any>>$resource('/api/person/:id', { id: '@id' }, { update: updateDescriptor});
            this.Account = $resource('/api/account/:id', { id: '@id' });
        }
    }

}  