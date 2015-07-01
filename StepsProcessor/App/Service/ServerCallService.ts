module Service {

    export class ServerCall {
        public Document: ng.resource.IResourceClass<any>;

        constructor($resource: ng.resource.IResourceService) {
            this.Document = $resource('/api/document/:id', { id: '@id'})
        }
    }

} 