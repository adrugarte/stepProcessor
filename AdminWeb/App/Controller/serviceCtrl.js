var Controller;
(function (Controller) {
    var service = (function () {
        function service(scope, Callback, Utils, $routeParams) {
            var self = this;
            self.scope = scope;
            self.scope.service = {};
            self.scope.routeParam = $routeParams;
            if (self.scope.routeParam.id && self.scope.routeParam.id > 0) {
                Callback.PersonService.get({ id: self.scope.routeParam.id }).$promise.then(function (service) {
                    self.scope.service = service;
                });
            }
            else if (self.scope.routeParam.customer) {
                Callback.Person.get({ id: self.scope.routeParam.customer }).$promise.then(function (customer) {
                    self.scope.service.personId = parseInt(customer.person.id);
                    self.scope.service.personName = customer.person.lastName + ", " + customer.person.firstName;
                }, function (error) {
                });
            }
            self.scope.services = Callback.Service.query();
            self.scope.save = function () {
                Callback.PersonService.save(self.scope.service).$promise.then(function (response) {
                    alert("Data Saved");
                }, function (error) {
                    alert("Data Error");
                });
            };
            self.scope.setPrice = function () {
                scope.service['Price'] = getService(self.scope.service['Id']).price;
            };
            var getService = function (id) {
                for (var i = 0; i < scope.services.length; ++i) {
                    if (scope.services[i]['id'] == id)
                        return scope.services[i];
                }
                return null;
            };
        }
        return service;
    })();
    Controller.service = service;
})(Controller || (Controller = {}));
//# sourceMappingURL=serviceCtrl.js.map