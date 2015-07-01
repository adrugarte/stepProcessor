module Directive {
    export interface IDocumentListDirectiveScope extends ng.IScope {
        documentList: {}[];
        remove: (idx:number) => void;
    }
    export class DocumentList implements ng.IDirective{
        public templateurl = "uploadlist.html";
        public scope = {};
        public restict = 'EA';
        public replace = true;
        public link: ng.IDirectiveLinkFn;
        public controller: ng.IControllerService;

        constructor(scope: IDocumentListDirectiveScope, ServerCall: Service.ServerCall) {
            this.controller = () => {
                ServerCall.Document.query().$promise.then((response) => {
                    scope.documentList = response;
                },
                    (error) => {
                        scope.documentList = [];
                    }
                    )
            };

            this.link = (scope: IDocumentListDirectiveScope, elm: ng.IAugmentedJQuery, attr: ng.IAttributes) => {
                scope.remove = (idx) => {



                }
            } 

        }
    }

} 