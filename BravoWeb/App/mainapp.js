var BravoWeb;
(function (BravoWeb) {
    "use strict";
    var AppBuilder = (function () {
        function AppBuilder(name) {
            this.app = angular.module(name, [
                "ngRoute",
                "ngResource"
            ]);
            var loadtemplates = function ($q, $http, $templateCache) {
                var call = $q.defer();
                var dptemplate = $http.get('App/templates/dptemplate.html');
                //var radiotemplate = $http.get('App/templates/radiotemplate.html');
                $q.all([dptemplate]).then(function (templates) {
                    $templateCache.put("datetimepicker.html", templates[0]);
                    //$templateCache.put("radio.html", templates[1].data);
                    call.resolve();
                }, function () {
                    call.reject();
                });
                return call.promise;
            };
            var mainRoute = {
                templateUrl: '/App/Views/indexView.html',
            };
            var contactRoute = {
                controller: 'contactCtrl',
                templateUrl: '/App/Views/ContactView.html'
            };
            var config = function ($routeProvider, $locationProvider, $httpProvider) {
                $routeProvider.when('/', mainRoute).when('/contact', contactRoute).otherwise({ redirectTo: '/' });
                //$httpProvider.interceptors.push('AuthInterceptorService');
                $locationProvider.html5Mode(true);
            };
            //// Config
            this.app.config(['$routeProvider', '$locationProvider', '$httpProvider', config]);
            //// Services
            this.app.service('CallbackSrv', ['$resource', function ($resource) {
                return new Service.ServerCall($resource);
            }]);
            ///// Directives
            ///// Controllers
            this.app.controller('contactCtrl', ['$scope', 'CallbackSrv', function ($scope, CallbackSrv) { return new Controller.formCtrl($scope, CallbackSrv); }]);
        }
        return AppBuilder;
    })();
    BravoWeb.AppBuilder = AppBuilder;
})(BravoWeb || (BravoWeb = {}));
var Controller;
(function (Controller) {
    var formCtrl = (function () {
        function formCtrl($scope, CallbackSrv) {
            var self = this;
            self.scope = $scope;
            self.scope.contact = {};
            self.scope.SubmitQuote = function () {
                CallbackSrv.contact.save(self.scope.contact, function () {
                    self.scope.contact.successmsg = "Your message has been submited";
                });
            };
        }
        return formCtrl;
    })();
    Controller.formCtrl = formCtrl;
})(Controller || (Controller = {}));
var Service;
(function (Service) {
    var ServerCall = (function () {
        function ServerCall($resource) {
            this.contact = $resource('/api/contact/:id', { id: '@id' });
        }
        return ServerCall;
    })();
    Service.ServerCall = ServerCall;
})(Service || (Service = {}));
/// <reference path="app.ts" />
new BravoWeb.AppBuilder('BravoWebApp');
//# sourceMappingURL=mainapp.js.map