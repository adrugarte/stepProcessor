module Service {
    export interface IServerCall {
        Document: ng.resource.IResourceClass<any>; 
        File: ng.resource.IResourceClass<any>;
    } 
    export class ServerCall implements IServerCall {
        public Document: ng.resource.IResourceClass<any>;
        public File: ng.resource.IResourceClass<any>;

        constructor($resource: ng.resource.IResourceService) {
            this.Document = $resource('/api/document/:id', { id: '@id' });
            this.File = $resource('/api/file');
        }
    }

} 