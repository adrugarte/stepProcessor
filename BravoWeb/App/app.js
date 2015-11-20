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
            //this.app.service('Resolver', ['$q', ($q: ng.IQService) => { return new Service.Resolver($q); }])
            ///// Directives
            ///// Controllers
            this.app.controller('contactCtrl', ['$scope', function ($scope) { return new Controller.formCtrl($scope); }]);
        }
        return AppBuilder;
    })();
    BravoWeb.AppBuilder = AppBuilder;
})(BravoWeb || (BravoWeb = {}));
//# sourceMappingURL=app.js.map