var Admin;
(function (Admin) {
    "use strict";
    var AppBuilder = (function () {
        function AppBuilder(name) {
            this.app = angular.module(name, [
                "ngRoute",
                "ngResource"
            ]);
            var mainRoute = {
                controller: 'mainCtrl',
                templateUrl: '/App/View/main.html'
            };
            var customerRoute = {
                controller: 'customerCtrl',
                templateUrl: '/App/View/customerList.html'
            };
            var config = function ($routeProvider, $locationProvider, $httpProvider) {
                $routeProvider.when('/', mainRoute).when('/customer', customerRoute).otherwise({ redirectTo: '/' });
                //$httpProvider.interceptors.push('AuthInterceptorService');
                $locationProvider.html5Mode(true);
            };
            //// Config
            this.app.config(['$routeProvider', '$locationProvider', '$httpProvider', config]);
            //// Services
            this.app.service('Callback', function ($resource) {
                return new Service.ServerCall($resource);
            });
            ///// Directives
            //this.app.directive('uploadFileList', ['ServerCall', (ServerCall: Service.IServerCall) => { return new Directive.DocumentList(ServerCall); }]);
            ///// Controllers
            this.app.controller('customerCtrl', function ($scope, Callback) { return new Controller.customer($scope, Callback); });
            this.app.controller('mainCtrl', function ($scope) { return new Controller.main($scope); });
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
        function customer(scope, Callback) {
            var self = this;
            self.scope = scope;
            self.scope.person = {};
            self.scope.personQuery = {};
            self.scope.saveCustomer = function () {
                Callback.Person.save(self.scope.person, function (Response) {
                    alert('Datos guardados');
                }, function (Error) {
                    alert('Han ocurrido errores al guardar los datos');
                });
            };
            self.scope.getCustomerList = function () {
                Callback.Person.query({ query: self.scope.personQuery, top: 50, offset: 0 }).$promise.then(function (response) {
                    self.scope.customerList = response;
                }, function (error) {
                    alert("Error:Somenthing went wrong");
                });
            };
            self.scope.getCustomerList();
        }
        return customer;
    })();
    Controller.customer = customer;
})(Controller || (Controller = {}));
var Controller;
(function (Controller) {
    var main = (function () {
        function main(scope) {
            var self = this;
            self.scope = scope;
            self.scope.texto = "Hello People";
        }
        return main;
    })();
    Controller.main = main;
})(Controller || (Controller = {}));
var Service;
(function (Service) {
    var ServerCall = (function () {
        function ServerCall($resource) {
            var uploadDescriptor = { method: "POST", isArray: false, transformRequest: angular.identity, headers: { 'Content-Type': undefined } };
            this.Person = $resource('/api/person/:id', { id: '@id' });
            this.Account = $resource('/api/account/:id', { id: '@id' });
        }
        return ServerCall;
    })();
    Service.ServerCall = ServerCall;
})(Service || (Service = {}));
//# sourceMappingURL=mainapp.js.map