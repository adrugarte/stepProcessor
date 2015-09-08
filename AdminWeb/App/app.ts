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
                templateUrl: '/App/View/customerList.html'
            }

            var config = ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider, $httpProvider: ng.IHttpProvider) => {
                $routeProvider.
                    when('/', mainRoute).
                    when('/customer', customerRoute).
                    otherwise({ redirectTo: '/' });

                //$httpProvider.interceptors.push('AuthInterceptorService');
                $locationProvider.html5Mode(true);
            };


            //// Config
            this.app.config(['$routeProvider', '$locationProvider', '$httpProvider', config]);
            //// Services
            this.app.service('Callback',($resource: ng.resource.IResourceService) => { return new Service.ServerCall($resource) });
            ///// Directives
            //this.app.directive('uploadFileList', ['ServerCall', (ServerCall: Service.IServerCall) => { return new Directive.DocumentList(ServerCall); }]);

            ///// Controllers
            this.app.controller('customerCtrl',($scope,Callback) => new Controller.customer($scope,Callback));
            this.app.controller('mainCtrl',($scope: Controller.ImainScope) => new Controller.main($scope));
        }
    }
}

new Admin.AppBuilder('AdminApp');  
angular.bootstrap($('body'), ['AdminApp']);
