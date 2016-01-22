module Directive {
    export interface IcustomerListScope extends ng.IScope{ 
        personQuery: any;
        customerList: Array<Models.IPerson>;
        page: number;
        top: number;
        limit: number;
        maxlimit: number;
        productCounter: number;
        search: () => void;
        next: () => void;
        prev: () => void;
    }

    export class customerList implements ng.IDirective {
        public link: ng.IDirectiveLinkFn;
        public replace = true;
        public scope = {page:'@'};
        public templateUrl = "App/view/customerList.html";
        public controller;
        constructor(Callback: Resource.IServerCall, $location: ng.ILocationService) {
            this.controller = customerListController;

            this.link = (scope: IcustomerListScope, elm: ng.IAugmentedJQuery, attr: ng.IAttributes) => {
                var self = this;
                //self.scope = scope;
                scope.personQuery = ""

                var getCustomerList = () => {
                    Callback.Person.get({ query: scope.personQuery, top: scope.top, offset: (scope.page*scope.top)}).$promise.
                        then((response) => {
                        scope.productCounter = response.counter;
                        scope.customerList = response.persons;
                        scope.limit = ((scope.page * scope.top) + scope.top) > response.counter ? response.counter - (scope.page * scope.top) : scope.top;
                    });
                }
                scope.search = () => {
                    getCustomerList();
                    //$location.search("query", !scope.personQuery ? "" : scope.personQuery);
                    //$location.search("page", scope.page);
                }

                scope.next = function () {
                    if ((scope.page * scope.top) + scope.top < scope.productCounter) {
                        scope.page = scope.page + 1; //parseInt(scope.query.top);
                        getCustomerList();
                    }
                };
                scope.prev = function () {
                    if (scope.page > 0) {
                        scope.page = scope.page - 1; //parseInt(scope.query.top);
                        getCustomerList();
                    }
                };
                scope.search();
            }

        }
    }


    export class customerListController {
        static $inject = ['$element', '$scope', 'Callback'];
        constructor(public $element: JQuery, public $scope: IcustomerListScope, ServerCall: Resource.IServerCall) {
            $scope.page = parseInt($scope.page.toString());
            $scope.top = 20;
        }
    }
}
 