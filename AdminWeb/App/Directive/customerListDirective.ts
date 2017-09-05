module Directive {
    export interface IcustomerListScope extends ng.IScope{ 
        personQuery: any;
        pendingPayment: any;
        customerList: Array<Models.IPerson>;
        page: number;
        top: number;
        limit: number;
        maxlimit: number;
        productCounter: number;
        showServices: (idx: number, event: any) => void;
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
        constructor(Callback: Resource.IServerCall, $compile: ng.ICompileService) {
            this.controller = customerListController;

            this.link = (scope: IcustomerListScope, elm: ng.IAugmentedJQuery, attr: ng.IAttributes) => {
                var self = this;
                //self.scope = scope;
                scope.personQuery = ""
                scope.pendingPayment = false;


                var getCustomerList = () => {
                    Callback.Person.get({ query: scope.personQuery, top: scope.top, offset: (scope.page*scope.top),pendingpayment:scope.pendingPayment}).$promise.
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


                scope.showServices = (idx: number, event:any) => {
                    var element = angular.element(event.target).closest("div.customer-line");
                    if (!(element.attr("shown") == "true")) {
                        var PersonId = scope.customerList[idx].id;
                        var content = "<div>" + "<person-service-list person-id ='" + PersonId + "'/>" + "</div>";
                        element.after($compile(content)(scope));
                        
                    }
                    else { element.next().remove(); }

                    element.attr("shown", element.attr("shown") == "true" ? "false" : "true");

                }

                scope.next = function () {
                    if ((scope.page * scope.top) + scope.top < scope.productCounter) {
                        scope.page = (scope.page*1) + 1;
                        getCustomerList();
                    }
                };
                scope.prev = function () {
                    if (scope.page > 0) {
                        scope.page = (scope.page*1) - 1; //Tuve q multiplicar por uno xq lo estaba trando como cadena y lo concatenaba
                        getCustomerList();
                    }
                };

                scope.$watch('pendingPayment', function () {
                    scope.search();
                });

                scope.search();
            }

        }
    }

    export class customerListController {
        static $inject = ['$element', '$scope', 'Callback'];
        constructor(public $element: JQuery, public $scope: IcustomerListScope, ServerCall: Resource.IServerCall) {
            $scope.page = parseInt($scope.page.toString());
            $scope.top = 10;
        }
    }
}
 