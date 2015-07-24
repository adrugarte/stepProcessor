module Directive {
    export interface IDocumentListDirectiveScope extends ng.IScope {
        documentList: Models.IFileToUpload[];
        remove: (idx: number) => void;
        upload: () => void;
        file: Models.IFileToUpload;
        documentType: Models.IDocumentType[];
        Adding: boolean;
    }
    export class DocumentList implements ng.IDirective{
        public templateUrl = "App/Templates/uploadlist.html";
        public scope = {};
        public restrict = 'EA';
        public replace = true;
        public link: ng.IDirectiveLinkFn;
        public controller;

        constructor(ServerCall: Service.IServerCall) {
            this.controller = DocumenListController;

            this.link = (scope: IDocumentListDirectiveScope, elm: ng.IAugmentedJQuery, attr: ng.IAttributes) => {
                scope.documentList = [];
                scope.Adding = false;
                scope.documentType = [
                    { Id: "type-1", TypeDesc: "Pasaporte" },
                    { Id: "type-2", TypeDesc: "Social Security" },
                    { Id: "type-3", TypeDesc: "Residencia" },
                    { Id: "type-4", TypeDesc: "Otro" },
                ]

                scope.upload = () => {
                    var fd = new FormData();
                    angular.forEach(scope.file, function (value, key) {
                        if (key == "Type") {
                            fd.append("TypeId", value["Id"]);
                            fd.append("TypeDesc", value["TypeDesc"]);
                        }else  fd.append(key, value);
                    })
                    ServerCall.File.upload(fd,(response) => {
                        scope.documentList.push(response);
                    },(error) => {
                            alert("error while saving" + error);
                        })
                    scope.file = { Type: null, OriginalName: "", Label: "",file:null }
                }

                scope.remove = (idx) => {
                    ServerCall.Document.delete({ id: scope.documentList[idx].Id },
                        (response) => {
                            scope.documentList.slice(idx, 1);
                        },(error) => { alert("error while deleting" +  error); });
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