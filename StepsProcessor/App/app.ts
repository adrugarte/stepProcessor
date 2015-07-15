/// <reference path="directive/stepfieldgenerator.ts" />
/// <reference path="../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../scripts/typings/moment/moment.d.ts" />

module StepProcessor {
    "use strict";
    export class AppBuilder {
        app: ng.IModule;
        constructor(name: string) {
            this.app = angular.module(name, [
            // Angular modules 
                "ngRoute",
                "ngResource",
                "AuthenticationModule",
                "ui.bootstrap.datetimepicker",
                "AgInputSelectModule"]);

            var loadtemplates = function ($q: ng.IQService, $http: ng.IHttpService, $templateCache: ng.ITemplateCacheService) {
                var call = $q.defer();
                var dptemplate = $http.get('App/templates/dptemplate.html');
                var radiotemplate = $http.get('App/templates/radiotemplate.html');
                $q.all([dptemplate, radiotemplate]).then(function (templates) {
                    $templateCache.put("datetimepicker.html", templates[0].data);
                    $templateCache.put("radio.html", templates[1].data);
                    call.resolve();
                });
                return call.promise;

            }

            var config = ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider, $httpProvider: ng.IHttpProvider) => {
                $routeProvider.when('/', { controller: 'mainCtrl', templateUrl: '/App/View/index.html' }).
                    when('/form', {
                    controller: 'formCtrl',
                    templateUrl: '/App/View/Form.html',
                    resolve: {
                        "template": function ($q: ng.IQService, $http: ng.IHttpService, $templateCache: ng.ITemplateCacheService) {
                            return loadtemplates($q,$http,$templateCache);
                        }
                    }
                    }).
                    when('/image', { templateUrl: '/App/View/imagetest.html' }).
                    when('/login', {controller:'logonCtrl', templateUrl: '/App/View/login.html' }).
                //    when('/mainmenu', { templateUrl: '/App/Views/mainmenu.html' }).
                //    when('/main/:Action', {controller: 'ImageCtrl', templateUrl: '/App/Views/contentlist.html', reloadOnSearch: false
                //}).
                    otherwise({ redirectTo: '/' });

                //$httpProvider.interceptors.push('AuthInterceptorService');
                $locationProvider.html5Mode(true);
            };

            var routechangeevent = ($rootScope: ng.IScope, $location: ng.ILocationService, authService: Service.IauthService) => {
                $rootScope.$on('$routeChangeStart',(event, next, current) => {
                    if (authService.requireLogin(next.$$route.originalPath) && authService.authentication.isAuth !== true) {
                        event.preventDefault();
                        alert("Please login before continue");
                    }
                });
            };

            //var loadtemplates = ($http: ng.IHttpService, $templateCache:ng.ITemplateCacheService) => {
            //    $http.get('App/templates/templates.html').success(function (response:any) {
            //        $templateCache.put('datetimepicker.html', response);
            //    });
            //}

            //// Run
            this.app.run(['$rootScope', '$location','authService', routechangeevent]);
            this.app.constant("moment", moment);
            //// Config
            this.app.config(['$routeProvider', '$locationProvider', '$httpProvider', config]);
            //// Services
            this.app.factory('ServerCall',($resource: ng.resource.IResourceService) => { return new Service.ServerCall($resource) }); 
            this.app.service('logedSites', ['$window', '$http', ($window, $http) => { return new Service.logedSites($window,$http) }]);
            this.app.service('settingService', ['$rootScope', '$window', ($rootScope, $window) => { return new Service.SettingsService($rootScope, $window) }]);
            this.app.service('authService', ['$window', '$http', '$q', '$location', 'logedSites', '$timeout', ($window, $http, $q, $location, logedSites, $timeout) => { return new Service.authService($window, $http, $q, $location, logedSites, $timeout) }]);
            this.app.service('Uploader',($http: ng.IHttpService) => { return new Service.Uploader($http) });
            ///// Directives
            this.app.directive('fileModel',($parse: ng.IParseService) => { return new Directive.fileModel($parse) });
            this.app.directive('ngName',($interpolate: ng.IInterpolateService) => { return new Directive.ngName($interpolate); });
            this.app.directive('stepFieldGenerator',($compile: ng.ICompileService, $templateCache: ng.ITemplateCacheService,$parse:ng.IParseService) => { return new Directive.StepFieldGenerator($compile, $templateCache,$parse); });
            this.app.directive('spDatetimePicker',($parse: ng.IParseService) => { return new Directive.spDatetimePicker($parse); });
            this.app.directive('dateformatter',($filter: ng.IFilterService) => { return new Directive.DateFormatter($filter); });
            this.app.directive('uploadFileList', ['ServerCall', (ServerCall:Service.IServerCall) => { return new Directive.DocumentList(ServerCall); }]);

            ///// Controllers
            this.app.controller('headCtrl', ['$scope', 'settingService', '$rootScope', ($scope, settingService, $rootScope) => new head.headCtrl($scope, settingService, $rootScope)]);
            this.app.controller('formCtrl',($scope, moment, template) => new StepProcessor.formCtrl($scope, moment, template));
            this.app.controller('mainCtrl',($scope, $location: ng.ILocationService, authService: Service.IauthService, Uploader) => new Controller.mainCtrl($scope, $location, authService, Uploader));
        }
    }
}

//module head {
//    "use strict";
//    export class AppBuilder {
//        app: ng.IModule;
//        constructor(name: string) {
//            this.app = angular.module(name, [
//            // Angular modules 
//                "ngRoute",
//                "ngResource",
//                "AuthenticationModule"
//            ]);

//            function config($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider, $httpProvider: ng.IHttpProvider) {
//                //$routeProvider.when('/', { templateUrl: '/App/View/head.html' }).
//                ////    when('/login', { controller: 'loginCtrl', templateUrl: '/App/views/login.html' }).
//                ////    when('/mainmenu', { templateUrl: '/App/Views/mainmenu.html' }).
//                ////    when('/main/:Action', {controller: 'ImageCtrl', templateUrl: '/App/Views/contentlist.html', reloadOnSearch: false
//                ////}).
//                //    otherwise({ redirectTo: '/' });

//                //$httpProvider.interceptors.push('AuthInterceptorService');
//                $locationProvider.html5Mode(true);
//            };
//            this.app.config(['$routeProvider', '$locationProvider', '$httpProvider', config]);
//            this.app.provider('$Settings', ['$window', '$rootScope', SharedService.SettingsProvider]);
//            this.app.service('settingService', ['$rootScope', '$window', ($rootScope, $window) => { return new Service.SettingsService($rootScope, $window) }]);
//            this.app.controller('headCtrl', ['$scope', 'settingService', '$rootScope', ($scope, settingService, $rootScope) => new head.headCtrl($scope, settingService, $rootScope)]);
            
//        }
//    }
//}
