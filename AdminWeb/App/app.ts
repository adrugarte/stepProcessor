module Admin {
    "use strict";
    export class AppBuilder {
        app: ng.IModule;
        constructor(name: string) {
            this.app = angular.module(name, [
            // Angular modules 
                "ngRoute",
                "ngResource"]);

            //var mainRoute: ng.route.IRoute = {
            //    controller: 'mainCtrl',
            //    templateUrl: '/App/View/customerList.html',
            //    resolve: {
            //        'persons': (Resolver: Resolver.CtrlResolver) => { return Resolver.mainCtrl(); }
            //    }
            //}


            var mainRoute: ng.route.IRoute = {
                controller: 'mainCtrl',
                templateUrl: '/App/View/customerList.html'
            }

            var customerRoute: ng.route.IRoute = {
                controller: 'customerCtrl',
                templateUrl: '/App/View/customerview.html'
            }
            var newcustomerRoute: ng.route.IRoute = {
                controller: 'customerCtrl',
                templateUrl: '/App/View/customerList.html'
            }
            var config = ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider, $httpProvider: ng.IHttpProvider) => {
                $routeProvider.
                    when('/', mainRoute).
                    when('/customer/:id', customerRoute).
                    otherwise({ redirectTo: '/' });

                //$httpProvider.interceptors.push('AuthInterceptorService');
                $locationProvider.html5Mode(true);
            };


            //// Config
            this.app.config(['$routeProvider', '$locationProvider', '$httpProvider', config]);
            //// Services
            this.app.service('Callback', ['$resource',($resource: ng.resource.IResourceService) => { return new Resource.ServerCall($resource); }]);
            this.app.service('Utils',[() => { return new Service.Utils(); }]);
            this.app.service('Resolver',['$q','Callback',($q: ng.IQService, Callback: Resource.IServerCall) => { return new Resolver.CtrlResolver($q, Callback); }]);

            ///// Directives
            //this.app.directive('uploadFileList', ['ServerCall', (ServerCall: Service.IServerCall) => { return new Directive.DocumentList(ServerCall); }]);
            this.app.directive('mbDatePicker', ['$parse', ($parse: ng.IParseService) => { return new Directive.spDatetimePicker($parse); }]);


            ///// Controllers
            this.app.controller('customerCtrl',($scope, Callback: Resource.IServerCall, Utils, $routeParams) => new Controller.customer($scope, Callback, Utils, $routeParams));
            this.app.controller('mainCtrl',($scope: Controller.ImainScope,Callback:Resource.IServerCall,Utils:Service.Utils) => new Controller.main($scope,Callback,Utils));
        }
    }
}

new Admin.AppBuilder('AdminApp');  
angular.bootstrap($('body'), ['AdminApp']);
