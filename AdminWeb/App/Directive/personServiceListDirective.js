var Directive;
(function (Directive) {
    var personServiceList = (function () {
        function personServiceList(Callback, window) {
            var _this = this;
            this.replace = true;
            this.scope = { personId: '@' };
            this.templateUrl = "App/view/personServiceList.html";
            this.link = function (scope, elm) {
                var self = _this;
                scope.personServiceList = [];
                //self.scope = scope;
                scope.services = Callback.Service.query();
                var getServicePrice = function (id) {
                    var price = 0;
                    for (var i = 0; i < scope.services.length; ++i) {
                        if (scope.services[i]['id'] == id)
                            price = scope.services[i]['price'];
                    }
                    return price;
                };
                var getService = function (id) {
                    for (var i = 0; i < scope.services.length; ++i) {
                        if (scope.services[i]['id'] == id)
                            return scope.services[i];
                    }
                    return null;
                };
                scope.Delete = function (idx) {
                    if (window.confirm("Are you sure to delete this service?")) {
                        Callback.PersonService.delete({ id: scope.personServiceList[idx]['id'] }).$promise.then(function (response) {
                            scope.personServiceList.splice(idx, 1);
                        });
                    }
                };
                //scope.Cancel = (idx) => {
                //    scope.personServiceList[idx].$rollbackViewValue();
                //}
                scope.Close = function (idx) {
                    if (window.confirm("Are you sure to close the service " + scope.personServiceList[idx].serviceDesc + "?")) {
                        scope.personServiceList[idx].finished = new Date().toLocaleString();
                        Callback.PersonService.save(scope.personServiceList[idx]);
                    }
                };
                scope.Add = function () {
                    if (!scope.newservice || !scope.newservice['Id'])
                        return;
                    var pservice = {};
                    var service = getService(scope.newservice['Id']);
                    pservice.serviceDesc = service.serviceDesc;
                    pservice.price = scope.newservice['Price'] != null ? scope.newservice['Price'] : service.price;
                    pservice.form = service.form;
                    pservice.personId = scope.personId;
                    pservice.PaidAmount = scope.newservice['Paid'];
                    pservice.serviceId = service.id;
                    Callback.PersonService.save(pservice).$promise.then(function (response) {
                        scope.personServiceList.push(response);
                        scope.newservice = {};
                    });
                };
                scope.setPrice = function () {
                    scope.newservice['Price'] = getService(scope.newservice['Id']).price;
                };
                scope.Save = function (idx) {
                    scope.personServiceList[idx];
                    Callback.PersonService.save(scope.personServiceList[idx]).$promise.then(function () {
                        scope.editing = false;
                    });
                };
                var getPersonServiceList = function () {
                    if (!scope.personId)
                        scope.personId = -1;
                    Callback.PersonService.query({ PersonId: scope.personId }).$promise.then(function (response) {
                        scope.personServiceList = response;
                    });
                };
                scope.search = function () {
                    getPersonServiceList();
                };
                scope.search = function () {
                    getPersonServiceList();
                };
                scope.search();
            };
        }
        return personServiceList;
    })();
    Directive.personServiceList = personServiceList;
})(Directive || (Directive = {}));
//# sourceMappingURL=personServiceListDirective.js.map