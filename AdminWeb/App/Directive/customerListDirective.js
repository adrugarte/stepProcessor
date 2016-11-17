var Directive;
(function (Directive) {
    var customerList = (function () {
        function customerList(Callback, $compile) {
            var _this = this;
            this.replace = true;
            this.scope = { page: '@' };
            this.templateUrl = "App/view/customerList.html";
            this.controller = customerListController;
            this.link = function (scope, elm, attr) {
                var self = _this;
                //self.scope = scope;
                scope.personQuery = "";
                var getCustomerList = function () {
                    Callback.Person.get({ query: scope.personQuery, top: scope.top, offset: (scope.page * scope.top) }).$promise.then(function (response) {
                        scope.productCounter = response.counter;
                        scope.customerList = response.persons;
                        scope.limit = ((scope.page * scope.top) + scope.top) > response.counter ? response.counter - (scope.page * scope.top) : scope.top;
                    });
                };
                scope.search = function () {
                    getCustomerList();
                    //$location.search("query", !scope.personQuery ? "" : scope.personQuery);
                    //$location.search("page", scope.page);
                };
                scope.showServices = function (idx, event) {
                    var element = angular.element(event.target).closest("div.customer-line");
                    if (!(element.attr("shown") == "true")) {
                        var PersonId = scope.customerList[idx].id;
                        var content = "<div>" + "<person-service-list person-id ='" + PersonId + "'/>" + "</div>";
                        element.after($compile(content)(scope));
                    }
                    else {
                        element.next().remove();
                    }
                    element.attr("shown", element.attr("shown") == "true" ? "false" : "true");
                };
                scope.next = function () {
                    if ((scope.page * scope.top) + scope.top < scope.productCounter) {
                        scope.page = (scope.page * 1) + 1;
                        getCustomerList();
                    }
                };
                scope.prev = function () {
                    if (scope.page > 0) {
                        scope.page = (scope.page * 1) - 1; //Tuve q multiplicar por uno xq lo estaba trando como cadena y lo concatenaba
                        getCustomerList();
                    }
                };
                scope.search();
            };
        }
        return customerList;
    })();
    Directive.customerList = customerList;
    var customerListController = (function () {
        function customerListController($element, $scope, ServerCall) {
            this.$element = $element;
            this.$scope = $scope;
            $scope.page = parseInt($scope.page.toString());
            $scope.top = 10;
        }
        customerListController.$inject = ['$element', '$scope', 'Callback'];
        return customerListController;
    })();
    Directive.customerListController = customerListController;
})(Directive || (Directive = {}));
//# sourceMappingURL=customerListDirective.js.map