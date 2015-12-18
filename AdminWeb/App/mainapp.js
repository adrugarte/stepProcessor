var Admin;
(function (Admin) {
    "use strict";
    var AppBuilder = (function () {
        function AppBuilder(name) {
            this.app = angular.module(name, [
                "ngRoute",
                "ngResource"
            ]);
            //var mainRoute: ng.route.IRoute = {
            //    controller: 'mainCtrl',
            //    templateUrl: '/App/View/customerList.html',
            //    resolve: {
            //        'persons': (Resolver: Resolver.CtrlResolver) => { return Resolver.mainCtrl(); }
            //    }
            //}
            var mainRoute = {
                controller: 'mainCtrl',
                templateUrl: '/App/View/customerList.html'
            };
            var customerRoute = {
                controller: 'customerCtrl',
                templateUrl: '/App/View/customerview.html'
            };
            var newcustomerRoute = {
                controller: 'customerCtrl',
                templateUrl: '/App/View/customerList.html'
            };
            var config = function ($routeProvider, $locationProvider, $httpProvider) {
                $routeProvider.when('/', mainRoute).when('/customer/:id', customerRoute).otherwise({ redirectTo: '/' });
                //$httpProvider.interceptors.push('AuthInterceptorService');
                $locationProvider.html5Mode(true);
            };
            //// Config
            this.app.config(['$routeProvider', '$locationProvider', '$httpProvider', config]);
            //// Services
            this.app.service('Callback', ['$resource', function ($resource) {
                return new Resource.ServerCall($resource);
            }]);
            this.app.service('Utils', [function () {
                return new Service.Utils();
            }]);
            this.app.service('Resolver', ['$q', 'Callback', function ($q, Callback) {
                return new Resolver.CtrlResolver($q, Callback);
            }]);
            ///// Directives
            //this.app.directive('uploadFileList', ['ServerCall', (ServerCall: Service.IServerCall) => { return new Directive.DocumentList(ServerCall); }]);
            this.app.directive('mbDatePicker', ['$parse', function ($parse) {
                return new Directive.spDatetimePicker($parse);
            }]);
            ///// Controllers
            this.app.controller('customerCtrl', function ($scope, Callback, Utils, $routeParams) { return new Controller.customer($scope, Callback, Utils, $routeParams); });
            this.app.controller('mainCtrl', function ($scope, Callback, Utils) { return new Controller.main($scope, Callback, Utils); });
        }
        return AppBuilder;
    })();
    Admin.AppBuilder = AppBuilder;
})(Admin || (Admin = {}));
new Admin.AppBuilder('AdminApp');
angular.bootstrap($('body'), ['AdminApp']);
var Controller;
(function (Controller) {
    var customer = (function () {
        function customer(scope, Callback, Utils, $routeParams) {
            var self = this;
            var CustomerId = $routeParams["id"];
            self.scope = scope;
            self.scope.person = {};
            self.scope.person.Address = {};
            self.scope.person.Phone = {};
            self.scope.person.Celular = {};
            self.scope.person.Email = {};
            self.scope.personQuery = {};
            self.scope.CustomerSources = Utils.Sources;
            self.scope.person.Address.Type = "Home";
            self.scope.person.Phone.Type = 'Phone';
            self.scope.person.Phone.Use = 'Private'; //private
            self.scope.person.Celular.Type = 'Cellular';
            self.scope.person.Celular.Use = 'Private'; //private
            self.scope.person.Email.Type = 'email';
            self.scope.person.Email.Use = 'Private'; //private
            var getCustomer = function () {
                Callback.Person.get({ id: CustomerId }, function (person) {
                    self.scope.person = person;
                });
            };
            self.scope.saveCustomer = function () {
                Callback.Person.save(self.scope.person, function (Response) {
                    alert('Datos guardados');
                }, function (Error) {
                    alert('Han ocurrido errores al guardar los datos');
                });
            };
            if (CustomerId > 0)
                getCustomer();
        }
        return customer;
    })();
    Controller.customer = customer;
})(Controller || (Controller = {}));
var Controller;
(function (Controller) {
    var main = (function () {
        function main(scope, Callback, Utils) {
            var self = this;
            self.scope = scope;
            self.scope.personQuery = {};
            //self.scope.customerList = resolver['persons'];
            self.scope.getCustomerList = function () {
                Callback.Person.query({ query: self.scope.personQuery, top: 50, offset: 0 }).$promise.then(function (response) {
                    self.scope.customerList = response;
                }, function (error) {
                    alert("Error:Somenthing went wrong");
                });
            };
            scope.getCustomerList();
        }
        return main;
    })();
    Controller.main = main;
})(Controller || (Controller = {}));
var Directive;
(function (Directive) {
    var spDatetimePicker = (function () {
        function spDatetimePicker($parse) {
            this.restrict = "E";
            this.replace = true;
            this.transclude = false;
            this.compile = function (element, attrs) {
                var modelAccessor = $parse(attrs.ngModel);
                var newElem = angular.element("<input class='form-control' id ='dtpck' type='text'></input>");
                element.replaceWith(newElem);
                return function (scope, element, attrs) {
                    var processChange = function () {
                        var date = new Date(element.datepicker("getDate").toString());
                        scope.$apply(function (scope) {
                            // Change bound variable
                            modelAccessor.assign(scope, date);
                        });
                    };
                    var dtOptions = {};
                    if (attrs.dtOptions)
                        dtOptions = attrs.dtOptions;
                    dtOptions.dateFormat = 'mm/dd/yy';
                    dtOptions.onClose = processChange;
                    dtOptions.onSelect = processChange;
                    dtOptions.changeMonth = true;
                    dtOptions.changeYear = true;
                    dtOptions.showButtonPanel = true;
                    dtOptions.currentText = "Today";
                    if (attrs["minDate"])
                        dtOptions.minDate = attrs["minDate"];
                    if (attrs["maxDate"])
                        dtOptions.maxDate = attrs["maxDate"];
                    if (attrs["yearRange"])
                        dtOptions.yearRange = attrs["yearRange"];
                    dtOptions.showAnim = "slide";
                    element.datepicker(dtOptions);
                    //scope.$watch(attrs.ngModel, function (newval, Oldval) {
                    //    alert("has changed" + newval + Oldval);
                    //})
                    scope.$watch(modelAccessor, function (val) {
                        var date = new Date(val);
                        element.datepicker("setDate", date);
                    });
                };
            };
        }
        return spDatetimePicker;
    })();
    Directive.spDatetimePicker = spDatetimePicker;
})(Directive || (Directive = {}));
var Resource;
(function (Resource) {
    var ServerCall = (function () {
        function ServerCall($resource) {
            var uploadDescriptor = { method: "POST", isArray: false, transformRequest: angular.identity, headers: { 'Content-Type': undefined } };
            this.Person = $resource('/api/person/:id', { id: '@id' });
            this.Account = $resource('/api/account/:id', { id: '@id' });
        }
        return ServerCall;
    })();
    Resource.ServerCall = ServerCall;
})(Resource || (Resource = {}));
var Resolver;
(function (Resolver) {
    "use strict";
    var CtrlResolver = (function () {
        function CtrlResolver($q, ServerCall) {
            this.mainCtrl = function () {
                var deferred = $q.defer();
                ServerCall.Person.query({ query: null, offset: 0, top: 25 }, function (persons) {
                    deferred.resolve(persons);
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            };
        }
        return CtrlResolver;
    })();
    Resolver.CtrlResolver = CtrlResolver;
})(Resolver || (Resolver = {}));
var Service;
(function (Service) {
    var Utils = (function () {
        function Utils() {
            var _sources = ['Flyer', 'Clarin', 'Facebook', 'Volantes ', 'Referido', 'Otros'];
            this.Sources = _sources;
        }
        return Utils;
    })();
    Service.Utils = Utils;
})(Service || (Service = {}));
//# sourceMappingURL=mainapp.js.map