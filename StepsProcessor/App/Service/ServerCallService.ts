module Service {
    export interface IServerCallResource<T> extends ng.resource.IResourceClass<any> {
        upload(data: Object, success: Function, error?: Function): T;
    }
    export interface IServerCall {
        Document: ng.resource.IResourceClass<any>; 
        File: IServerCallResource<Models.IFileToUpload>; 
    } 
    export class ServerCall implements IServerCall {
        public Document: ng.resource.IResourceClass<any>;
        public File: IServerCallResource<Models.IFileToUpload>; 

        constructor($resource: ng.resource.IResourceService) {
            var uploadDescriptor: ng.resource.IActionDescriptor = { method: "POST", isArray:false, transformRequest: angular.identity, headers: { 'Content-Type': undefined } };

            this.Document = $resource('/api/document/:id', { id: '@id' });
            this.File = <IServerCallResource<Models.IFileToUpload>> $resource('/api/file', {}, { upload: uploadDescriptor });
        }
    }

} 