module BravoWeb {
    "use strict";
    export class AppBuilder {
        app: ng.IModule;
        constructor(name: string) {
            this.app = angular.module(name, [
            // Angular modules 
                "ngRoute",
                "ngResource"]);

            var loadtemplates = function ($q: ng.IQService, $http: ng.IHttpService, $templateCache: ng.ITemplateCacheService) {
                var call = $q.defer();
                var dptemplate = $http.get('App/templates/dptemplate.html');
                //var radiotemplate = $http.get('App/templates/radiotemplate.html');
                $q.all([dptemplate]).then(function (templates) {
                    $templateCache.put("datetimepicker.html", templates[0]);
                    //$templateCache.put("radio.html", templates[1].data);
                    call.resolve();
                }, function () { call.reject(); });
                return call.promise;
            }

            var mainRoute: ng.route.IRoute = {
                templateUrl: '/App/Views/indexView.html',
            }

            var contactRoute: ng.route.IRoute = {
                controller: 'contactCtrl',
                templateUrl: '/App/Views/ContactView.html'
            }

            var config = ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider, $httpProvider: ng.IHttpProvider) => {
                $routeProvider.
                    when('/', mainRoute).
                    when('/contact', contactRoute).
                    otherwise({ redirectTo: '/' });

                //$httpProvider.interceptors.push('AuthInterceptorService');
                $locationProvider.html5Mode(true);
            };

            //// Config
            this.app.config(['$routeProvider', '$locationProvider', '$httpProvider', config]);
            //// Services
            this.app.service('CallbackSrv', ['$resource', ($resource:ng.resource.IResourceService) => { return new Service.ServerCall($resource); }])
            ///// Directives

            ///// Controllers
            this.app.controller('contactCtrl', ['$scope', 'CallbackSrv', ($scope:Controller.IContactCtrlScope,CallbackSrv:Service.IServerCall) => new Controller.formCtrl($scope,CallbackSrv)]);
        }
    }
}
