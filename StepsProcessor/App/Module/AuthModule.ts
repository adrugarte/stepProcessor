module Authentication {
    "use strict";
    export class AppBuilder {
        app: ng.IModule;
        constructor(name: string) {
            this.app = angular.module(name, []);
            this.app.service('logedSites', ['$window', '$http', ($window: ng.IWindowService, $http: ng.IHttpService) => { return new Service.logedSites($window, $http) }]);
            this.app.service('AuthService', ['$window', '$http', '$q', '$location', 'logedSites', '$timeout', ($window:ng.IWindowService, $http:ng.IHttpService, $q:ng.IQService, $location:ng.ILocationService, logedSites:Service.ILogedSites, $timeout:ng.ITimeoutService) => { return new Service.authService($window, $http,$q,$location,logedSites,$timeout) }]);
        }
    }
} 

new Authentication.AppBuilder('AuthenticationModule');