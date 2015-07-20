module Directive {
    export interface IDocumentListDirectiveScope extends ng.IScope {
        documentList: Models.IFileToUpload[];
        remove: (idx: number) => void;
        upload: () => void;
        UploadFile: Models.IFileToUpload;
    }
    export class DocumentList implements ng.IDirective{
        public templateUrl = "App/Templates/uploadlist.html";
        public scope = {};
        public restrict = 'EA';
        public replace = true;
        public link: ng.IDirectiveLinkFn;
        public controller;

        constructor(ServerCall: Service.ServerCall) {
            this.controller = DocumenListController;

            this.link = (scope: IDocumentListDirectiveScope, elm: ng.IAugmentedJQuery, attr: ng.IAttributes) => {
                scope.documentList = [];

                scope.upload = () => {
                    ServerCall.Document.save(scope.UploadFile,(response) => {
                        scope.documentList.push(response);
                    },() => { alert("error while saving");})
                }

                scope.remove = (idx) => {
                    ServerCall.Document.delete({ id: scope.documentList[idx].Id },
                        (response) => {
                            scope.documentList.slice(idx, 1);
                        },() => { alert("error while deleting"); });
                }
            } 

        }
    }

    export class DocumenListController {
        static $inject = ['$element','$scope','ServerCall'];
        constructor(public $element: JQuery, public $scope: IDocumentListDirectiveScope, ServerCall:Service.IServerCall) {
            ServerCall.Document.query().$promise.then((response) => {
                $scope.documentList = response;
            },
                (error) => {
                    $scope.documentList = [];
                })
        }
    }

} 