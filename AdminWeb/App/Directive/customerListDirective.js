var Directive;
(function (Directive) {
    var customerList = (function () {
        function customerList(Callback, $location) {
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
            $scope.top = 20;
        }
        customerListController.$inject = ['$element', '$scope', 'Callback'];
        return customerListController;
    })();
    Directive.customerListController = customerListController;
})(Directive || (Directive = {}));
//# sourceMappingURL=customerListDirective.js.map