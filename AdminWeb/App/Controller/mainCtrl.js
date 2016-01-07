var Controller;
(function (Controller) {
    var main = (function () {
        function main(scope, Callback, Utils, $routeParams) {
            scope.currentListPage = $routeParams["page"] ? $routeParams["page"] : 0;
            scope.query = $routeParams["query"] ? $routeParams["query"] : "";
            //self.scope.personQuery = {};
            ////self.scope.customerList = resolver['persons'];
            //self.scope.getCustomerList = () => {
            //    Callback.Person.query({ query: self.scope.personQuery, top: 50, offset: 0 }).$promise.
            //        then((response) => {
            //        self.scope.customerList = response;
            //    },
            //        (error) => {
            //            alert("Error:Somenthing went wrong");
            //        });
            //}
            //scope.getCustomerList();
        }
        return main;
    })();
    Controller.main = main;
})(Controller || (Controller = {}));
//# sourceMappingURL=mainCtrl.js.map