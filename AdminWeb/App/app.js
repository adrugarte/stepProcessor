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
                templateUrl: '/App/View/customerview.html'
            };
            var newcustomerRoute = {
                controller: 'customerCtrl',
                templateUrl: '/App/View/customerList.html'
            };
            var servicesRoute = {
                controller: 'servicesCtrl',
                templateUrl: '/App/View/services.html'
            };
            var config = function ($routeProvider, $locationProvider, $httpProvider) {
                $routeProvider.when('/', mainRoute).when('/customer/:id', customerRoute).when('/services', servicesRoute).otherwise({ redirectTo: '/' });
                //$httpProvider.interceptors.push('AuthInterceptorService');
                $locationProvider.html5Mode(true);
            };
            //// Config
            this.app.config(['$routeProvider', '$locationProvider', '$httpProvider', config]);
            ///Filter
            this.app.filter('phonenumber', [function () {
                return (new Filters.forPhone()).filter;
            }]);
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
            this.app.directive('customerList', ['Callback', '$compile', function (Callback, $compile) {
                return new Directive.customerList(Callback, $compile);
            }]);
            this.app.directive('phoneNumber', ['$filter', '$browser', function ($filter, $browser) {
                return new Directive.phoneInput($filter, $browser);
            }]);
            this.app.directive('personServiceList', ['Callback', '$window', function (Callback, window) {
                return new Directive.personServiceList(Callback, window);
            }]);
            //this.app.directive('onlyNumber', [() => { return new Directive.OnlyNumber(); }]);
            ///// Controllers
            this.app.controller('customerCtrl', ['$scope', 'Callback', 'Utils', '$routeParams', function ($scope, Callback, Utils, $routeParams) { return new Controller.customer($scope, Callback, Utils, $routeParams); }]);
            this.app.controller('mainCtrl', ['$scope', 'Callback', 'Utils', '$routeParams', function ($scope, Callback, Utils, $routeParams) { return new Controller.main($scope, Callback, Utils, $routeParams); }]);
        }
        return AppBuilder;
    })();
    Admin.AppBuilder = AppBuilder;
})(Admin || (Admin = {}));
new Admin.AppBuilder('AdminApp');
angular.bootstrap($('body'), ['AdminApp']);
//# sourceMappingURL=app.js.map