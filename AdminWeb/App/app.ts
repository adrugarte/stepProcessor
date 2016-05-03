module Admin {
    "use strict";
    export class AppBuilder {
        app: ng.IModule;
        constructor(name: string) {
            this.app = angular.module(name, [
            // Angular modules 
                "ngRoute",
                "ngResource"]);


            var mainRoute: ng.route.IRoute = {
                controller: 'mainCtrl',
                templateUrl: '/App/View/main.html'
            }

            var customerRoute: ng.route.IRoute = {
                controller: 'customerCtrl',
                templateUrl: '/App/View/customerview.html'
            }
            var newcustomerRoute: ng.route.IRoute = {
                controller: 'customerCtrl',
                templateUrl: '/App/View/customerList.html'
            }

            var servicesRoute: ng.route.IRoute = {
                controller: 'servicesCtrl',
                templateUrl: '/App/View/services.html'
            }

            var config = ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider, $httpProvider: ng.IHttpProvider) => {
                $routeProvider.
                    when('/', mainRoute).
                    when('/customer/:id', customerRoute).
                    when('/services', servicesRoute).
                    otherwise({ redirectTo: '/' });

                //$httpProvider.interceptors.push('AuthInterceptorService');
                $locationProvider.html5Mode(true);
            };


            //// Config
            this.app.config(['$routeProvider', '$locationProvider', '$httpProvider', config]);

            ///Filter
            this.app.filter('phonenumber', [() => { return (new Filters.forPhone()).filter;}]);
            
            //// Services
            this.app.service('Callback', ['$resource',($resource: ng.resource.IResourceService) => { return new Resource.ServerCall($resource); }]);
            this.app.service('Utils',[() => { return new Service.Utils(); }]);
            this.app.service('Resolver',['$q','Callback',($q: ng.IQService, Callback: Resource.IServerCall) => { return new Resolver.CtrlResolver($q, Callback); }]);

            ///// Directives
            //this.app.directive('uploadFileList', ['ServerCall', (ServerCall: Service.IServerCall) => { return new Directive.DocumentList(ServerCall); }]);
            this.app.directive('mbDatePicker', ['$parse', ($parse: ng.IParseService) => { return new Directive.spDatetimePicker($parse); }]);
            this.app.directive('customerList', ['Callback', '$compile', (Callback: Resource.IServerCall, $compile: ng.ICompileService) => { return new Directive.customerList(Callback, $compile); }]);
            this.app.directive('phoneNumber', ['$filter', '$browser', ($filter: ng.IFilterService, $browser: ng.IBrowserService) => { return new Directive.phoneInput($filter, $browser); }]);
            this.app.directive('personServiceList', ['Callback','$window', (Callback: Resource.IServerCall,window:ng.IWindowService) => { return new Directive.personServiceList(Callback,window); }]);
            //this.app.directive('onlyNumber', [() => { return new Directive.OnlyNumber(); }]);

            ///// Controllers
            this.app.controller('customerCtrl', ['$scope', 'Callback', 'Utils', '$routeParams',($scope, Callback: Resource.IServerCall, Utils, $routeParams) => new Controller.customer($scope, Callback, Utils, $routeParams)]);
            this.app.controller('mainCtrl', ['$scope', 'Callback','Utils','$routeParams',($scope: Controller.ImainScope, Callback: Resource.IServerCall, Utils: Service.Utils, $routeParams: ng.route.IRouteParamsService) => new Controller.main($scope, Callback, Utils, $routeParams)]);
        }
    }
}

new Admin.AppBuilder('AdminApp');  
angular.bootstrap($('body'), ['AdminApp']);
