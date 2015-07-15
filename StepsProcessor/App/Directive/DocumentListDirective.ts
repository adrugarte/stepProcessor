module Directive {
    export interface IDocumentListDirectiveScope extends ng.IScope {
        documentList: {}[];
        remove: (idx: number) => void;
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
                scope.remove = (idx) => {
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