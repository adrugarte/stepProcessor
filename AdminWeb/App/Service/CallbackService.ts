module Service {
    export interface IServerCall {
        Person: ng.resource.IResourceClass<any>;
    }
    export class ServerCall implements IServerCall {
        public Person: ng.resource.IResourceClass<any>;
  
        constructor($resource: ng.resource.IResourceService) {
            var uploadDescriptor: ng.resource.IActionDescriptor = { method: "POST", isArray: false, transformRequest: angular.identity, headers: { 'Content-Type': undefined } };

            this.Person = $resource('/api/person/:id', { id: '@id' });
        }
    }

}  