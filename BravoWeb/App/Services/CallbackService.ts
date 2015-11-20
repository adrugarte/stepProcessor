module Service {
    export interface IServerCall {
        contact: ng.resource.IResourceClass<any>;
    }
    export class ServerCall implements IServerCall {
        public contact: ng.resource.IResourceClass<any>;
        constructor($resource: ng.resource.IResourceService) {
            this.contact = $resource('/api/contact/:id', { id: '@id' });
        }
    }

}  