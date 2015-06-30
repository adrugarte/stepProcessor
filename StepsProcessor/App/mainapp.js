/// <reference path="../models/models.ts" />
var Directive;
(function (Directive) {
    'use strict';
    var StepFieldGenerator = (function () {
        function StepFieldGenerator($compile, $templateCache, $parse) {
            this.restrict = 'AE';
            this.require = '^form';
            this.replace = true;
            var template = {
                input: '<label class="[labelclass]" [labelstyle] for="[for]">{{item.field}}:</label><div class="[fieldclass]"><input id="[id]" class="form-control" ng-class="{\'fielderror\': stepform.[field].$error.required && !stepform.[field].$pristine}" type="text" name="{{item.field}}" ng-model="[fieldngmodel]" [required]/>[error]</div>',
                email: '<label class="[labelclass]" [labelstyle] for="[for]">{{item.field}}:</label><div class="[fieldclass]"><input class="form-control" type="email" name="{{item.field}}" ng-class="{\'fielderror\': stepform.[field].$error.email && !stepform.[field].$pristine}" ng-model="[fieldngmodel]" [required]/>[error]</div>',
                dropdownlist: '<label class="[labelclass]" [labelstyle] for="[for]">{{item.field}}:</label><ag-input-select class="[fieldclass]" ng-model="[ngmodel]" dropdown-id="[field]" [inputname] start-dropindex="[dropindex]" is-options="[optionlist]" />',
                datetimepicker: { template: 'datetimepicker.html' },
                radio: { template: 'radio.html' }
            };
            this.link = function (scope, el, attrs, formCtrl) {
                var validemail = '<span class="error" ng-show="stepform[\'[field]\'].$error.email">Not valid email!</span>';
                var requiredfield = '<span class="error" ng-show="stepform[\'[field]\'].$error.required && !stepform[\'[field]\'].$pristine">[field] can\'t be empty!</span>';
                var errors = "";
                var linktemplate;
                scope.item = $parse(attrs.item)(scope);
                switch (scope.item.fieldtype) {
                    case "string":
                        linktemplate = template.input;
                        linktemplate = linktemplate.replace("[fieldngmodel]", scope.item.ngmodel).replace("[divclass]", scope.item.divclass).replace("[for]", scope.item.field).replace("[id]", scope.item.field).replace("[labelclass]", scope.item.labelclass ? scope.item.labelclass : "").replace("[labelstyle]", scope.item.labelstyle ? scope.item.labelstyle : "").replace("[fieldclass]", scope.item.fieldclass ? scope.item.fieldclass : "").replace("[required]", scope.item.required ? scope.item.required : "");
                        break;
                    case "email":
                        linktemplate = template.email;
                        linktemplate = linktemplate.replace("[fieldngmodel]", scope.item.ngmodel).replace("[divclass]", scope.item.divclass).replace("[for]", scope.item.field).replace("[id]", scope.item.field).replace("[labelclass]", scope.item.labelclass ? scope.item.labelclass : "").replace("[labelstyle]", scope.item.labelstyle ? scope.item.labelstyle : "").replace("[fieldclass]", scope.item.fieldclass ? scope.item.fieldclass : "");
                        break;
                    case "datetime":
                        linktemplate = $templateCache.get(template.datetimepicker.template);
                        linktemplate = replaceAll(replaceAll(linktemplate, "[fieldngmodel]", scope.item.ngmodel), "[divclass]", scope.item.divclass);
                        linktemplate = linktemplate.replace("[fieldngmodel]", scope.item.ngmodel).replace("[divclass]", scope.item.divclass).replace("[for]", scope.item.field).replace("[id]", scope.item.field).replace("[labelclass]", scope.item.labelclass ? scope.item.labelclass : "").replace("[labelstyle]", scope.item.labelstyle ? scope.item.labelstyle : "").replace("[fieldclass]", scope.item.fieldclass ? scope.item.fieldclass : "").replace("[formatter]", scope.item.dataformater ? scope.item.dataformater : "").replace("[inputstyle]", scope.item.dpstyle ? scope.item.dpstyle : "");
                        break;
                    case "radio":
                        linktemplate = $templateCache.get(template.radio.template);
                        linktemplate = linktemplate.replace("[fieldngmodel]", scope.item.ngmodel).replace("[divclass]", scope.item.divclass).replace("[id]", scope.item.field).replace("[labelclass]", scope.item.labelclass ? scope.item.labelclass : "").replace("[radioclass]", scope.item.radioclass ? scope.item.radioclass : "").replace("[labelstyle]", scope.item.labelstyle ? scope.item.labelstyle : "").replace("[fieldclass]", scope.item.fieldclass ? scope.item.fieldclass : "").replace("[radioList]", scope.item.radiolist ? scope.item.radiolist : "").replace("[showfield]", scope.item.showfield ? scope.item.showfield : "");
                        linktemplate = replaceAll(linktemplate, "[valuefield]", scope.item.valuefield);
                        break;
                    case "dropdownlist":
                        linktemplate = template.dropdownlist;
                        for (var key in scope.item) {
                            linktemplate = replaceAll(linktemplate, "[" + key + "]", scope.item[key] ? scope.item[key] : "");
                        }
                        break;
                    default:
                        break;
                }
                linktemplate = replaceAll(linktemplate, "[field]", scope.item.field);
                if (scope.item.required == "required") {
                    errors = errors + replaceAll(requiredfield, "[field]", scope.item.field);
                }
                if (scope.item.fieldtype == "email") {
                    errors = errors + replaceAll(validemail, "[field]", scope.item.field);
                }
                if (scope.item.fieldtype == "email" || scope.item.fieldtype == "string") {
                    linktemplate = replaceAll('<div class= "[divclass]" >', "[divclass]", scope.item.divclass) + '<ng-form name="stepform">' + replaceAll(linktemplate, "[error]", errors) + '</ng-form>{{stepform}}</div>';
                }
                el.replaceWith($compile(angular.element(linktemplate))(scope));
                //formCtrl.$addControl();
                function escapeRegExp(str) {
                    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
                }
                function replaceAll(str, find, replace) {
                    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
                }
            };
        }
        return StepFieldGenerator;
    })();
    Directive.StepFieldGenerator = StepFieldGenerator;
})(Directive || (Directive = {}));
/// <reference path="directive/stepfieldgenerator.ts" />
/// <reference path="../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../scripts/typings/moment/moment.d.ts" />
var StepProcessor;
(function (StepProcessor) {
    "use strict";
    var AppBuilder = (function () {
        function AppBuilder(name) {
            this.app = angular.module(name, [
                "ngRoute",
                "ngResource",
                "AuthenticationModule",
                "ui.bootstrap.datetimepicker",
                "AgInputSelectModule"
            ]);
            var loadtemplates = function ($q, $http, $templateCache) {
                var call = $q.defer();
                var dptemplate = $http.get('App/templates/dptemplate.html');
                var radiotemplate = $http.get('App/templates/radiotemplate.html');
                $q.all([dptemplate, radiotemplate]).then(function (templates) {
                    $templateCache.put("datetimepicker.html", templates[0].data);
                    $templateCache.put("radio.html", templates[1].data);
                    call.resolve();
                });
                return call.promise;
            };
            var config = function ($routeProvider, $locationProvider, $httpProvider) {
                $routeProvider.when('/', { controller: 'mainCtrl', templateUrl: '/App/View/index.html' }).when('/form', {
                    controller: 'formCtrl',
                    templateUrl: '/App/View/Form.html',
                    resolve: {
                        "template": function ($q, $http, $templateCache) {
                            return loadtemplates($q, $http, $templateCache);
                        }
                    }
                }).when('/image', { templateUrl: '/App/View/imagetest.html' }).when('/login', { controller: 'logonCtrl', templateUrl: '/App/View/login.html' }).otherwise({ redirectTo: '/' });
                //$httpProvider.interceptors.push('AuthInterceptorService');
                $locationProvider.html5Mode(true);
            };
            var routechangeevent = function ($rootScope, $location, authService) {
                $rootScope.$on('$routeChangeStart', function (event, next, current) {
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
            //this.app.run(['$http', '$templateCache', loadtemplates]);
            this.app.run(['$rootScope', '$location', 'authService', routechangeevent]);
            this.app.constant("moment", moment);
            this.app.config(['$routeProvider', '$locationProvider', '$httpProvider', config]);
            this.app.controller('headCtrl', ['$scope', 'settingService', '$rootScope', function ($scope, settingService, $rootScope) { return new head.headCtrl($scope, settingService, $rootScope); }]);
            this.app.service('logedSites', ['$window', '$http', function ($window, $http) {
                return new Service.logedSites($window, $http);
            }]);
            this.app.service('settingService', ['$rootScope', '$window', function ($rootScope, $window) {
                return new Service.SettingsService($rootScope, $window);
            }]);
            this.app.service('authService', ['$window', '$http', '$q', '$location', 'logedSites', '$timeout', function ($window, $http, $q, $location, logedSites, $timeout) {
                return new Service.authService($window, $http, $q, $location, logedSites, $timeout);
            }]);
            this.app.directive('ngName', function ($interpolate) {
                return new Directive.ngName($interpolate);
            });
            this.app.directive('stepFieldGenerator', function ($compile, $templateCache, $parse) {
                return new Directive.StepFieldGenerator($compile, $templateCache, $parse);
            });
            this.app.directive('spDatetimePicker', function ($parse) {
                return new Directive.spDatetimePicker($parse);
            });
            this.app.directive('dateformatter', function ($filter) {
                return new Directive.DateFormatter($filter);
            });
            this.app.controller('formCtrl', function ($scope, moment, template) { return new StepProcessor.formCtrl($scope, moment, template); });
            this.app.controller('mainCtrl', function ($scope, $location, authService) { return new Controller.mainCtrl($scope, $location, authService); });
        }
        return AppBuilder;
    })();
    StepProcessor.AppBuilder = AppBuilder;
})(StepProcessor || (StepProcessor = {}));
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
var StepProcessor;
(function (StepProcessor) {
    var formCtrl = (function () {
        function formCtrl($scope, moment, template) {
            moment.locale('en');
            var self = this;
            self.scope = $scope;
            self.scope.person = {};
            self.scope.FormFields = [];
            self.scope.FormFields.push({ field: "Name", fieldtype: "string", maxlenght: 50, ngmodel: "person.firstname", divclass: "col-md-12 form-group", labelclass: "textlabelclass", fieldclass: "textfieldclass", required: "required" });
            self.scope.FormFields.push({ field: "LastName", fieldtype: "string", maxlenght: 50, ngmodel: "person.lastname", divclass: "col-md-12 form-group", labelclass: "textlabelclass", fieldclass: "textfieldclass", required: "required" });
            self.scope.FormFields.push({ field: "Middle", fieldtype: "string", maxlenght: 50, ngmodel: "person.middlename", divclass: "col-md-12 form-group", labelclass: "textlabelclass", fieldclass: "textfieldclass" });
            self.scope.FormFields.push({ field: "BirthDate", fieldtype: "datetime", maxlenght: 160, ngmodel: "person.bithdate", divclass: "col-md-12 form-group", labelclass: "textlabelclass", fieldclass: "form-control dpfieldclass", dataformater: "dateformatter", dpstyle: "style='max-width:180px;'" });
            self.scope.FormFields.push({ field: "StatingDate", fieldtype: "datetime", maxlenght: 160, ngmodel: "person.startdate", divclass: "col-md-12 form-group", labelclass: "textlabelclass", fieldclass: "form-control dpfieldclass", dataformater: "dateformatter", dpstyle: "style='max-width:180px;'" });
            self.scope.FormFields.push({ field: "Genre", fieldtype: "radio", maxlenght: 160, ngmodel: "person.genre", divclass: "col-md-12 form-group", radioclass: "radio-inline", labelclass: "textlabelclass", fieldclass: "form-control", radiolist: "Genres", valuefield: "id", showfield: "description" });
            self.scope.FormFields.push({ field: "Email", fieldtype: "email", maxlenght: 50, ngmodel: "person.email", divclass: "col-md-6 form-group", labelclass: "textlabelclass", fieldclass: "textfieldclass" });
            self.scope.FormFields.push({ field: "Education", fieldtype: "dropdownlist", ngmodel: "person.education", divclass: "col-md-6 form-group", labelclass: "textlabelclass", fieldclass: "textfieldclass", optionlist: "eItem.desc for eItem in education", dropindex: "0", labelstyle: "", "for": "", inputname: "" });
            self.scope.Genres = [];
            self.scope.Genres.push({ id: 1, description: "Male", checked: "checked" });
            self.scope.Genres.push({ id: 2, description: "Female", checked: "" });
            self.scope.Genres.push({ id: 3, description: "OtherOne", checked: "" });
            self.scope.Genres.push({ id: 4, description: "OtherTwo", checked: "" });
            self.scope.education = [];
            self.scope.education.push({ id: 1, desc: "Education1" });
            self.scope.education.push({ id: 2, desc: "Education2" });
            self.scope.education.push({ id: 3, desc: "Education3" });
            self.scope.education.push({ id: 4, desc: "Education4" });
            self.scope.education.push({ id: 5, desc: "Education5" });
            self.scope.education.push({ id: 6, desc: "Education6" });
            self.scope.education.push({ id: 7, desc: "Education7" });
        }
        return formCtrl;
    })();
    StepProcessor.formCtrl = formCtrl;
})(StepProcessor || (StepProcessor = {}));
var head;
(function (head) {
    var headCtrl = (function () {
        function headCtrl($scope, SettingsService, $rootScope) {
            var self = this;
            self.scope = $scope;
            self.scope.template = "App/View/head.html";
            self.scope.settings = SettingsService;
            self.scope.change = function () {
                self.scope.settings.setcontactphone("999 999 9999");
            };
            self.scope.refresh = function () {
                $scope.$apply();
            };
        }
        return headCtrl;
    })();
    head.headCtrl = headCtrl;
})(head || (head = {}));
var Controller;
(function (Controller) {
    var loginCtrl = (function () {
        function loginCtrl($scope, $location, authService) {
            $scope.loginData = {
                userName: "",
                password: "",
            };
            $scope.message = "";
            authService.logOut();
            $scope.login = function () {
                authService.login($scope.loginData).then(function (response) {
                    if (authService.authentication.redirectTo.length > 0)
                        $location.path(authService.authentication.redirectTo);
                    else
                        $location.path('mainmenu');
                    //console.log("Redirection from: " + authService.authentication.redirectTo);
                    authService.authentication.redirectTo = "";
                }, function (err) {
                    $scope.message = err.error_description;
                });
            };
        }
        return loginCtrl;
    })();
    Controller.loginCtrl = loginCtrl;
})(Controller || (Controller = {}));
var Controller;
(function (Controller) {
    var mainCtrl = (function () {
        function mainCtrl($scope, $location, AuthService) {
            var self = this;
            self.scope = $scope;
            //self.scope.settings = SettingsService;
            self.scope.authService = AuthService;
            self.scope.logData = { password: '', userName: '' };
            self.scope.authService.authentication.userName;
            self.scope.login = function () {
                AuthService.login($scope.logData).then(function (response) {
                    if (AuthService.authentication.redirectTo.length > 0)
                        $location.path(AuthService.authentication.redirectTo);
                    //console.log("Redirection from: " + authService.authentication.redirectTo);
                    AuthService.authentication.redirectTo = "";
                }, function (err) {
                    alert("El inicio de sesion ha fallado, las credenciales no son validas");
                });
                self.scope.logData = { password: "", userName: "" };
            };
        }
        return mainCtrl;
    })();
    Controller.mainCtrl = mainCtrl;
})(Controller || (Controller = {}));
var Directive;
(function (Directive) {
    var DateFormatter = (function () {
        function DateFormatter($filter) {
            this.require = 'ngModel';
            this.link = function (scope, elm, attrs, ngModelCtrl) {
                ngModelCtrl.$parsers.push(function (data) {
                    if (angular.isDate(data))
                        return new Date(data).toUTCString(); //converted
                    else
                        return data;
                });
                ngModelCtrl.$formatters.push(function (data) {
                    //convert data from model format to view format
                    if (angular.isDate(data))
                        return $filter('date')(data, 'MM/dd/yyyy'); //converted
                    else
                        return data;
                });
            };
        }
        return DateFormatter;
    })();
    Directive.DateFormatter = DateFormatter;
    var ngName = (function () {
        function ngName($interpolate) {
            this.priority = 9999;
            this.controller = function ($scope, $attrs) {
                var interpolatedName = $interpolate($attrs['ngName'])($scope);
                if (interpolatedName)
                    $attrs.$set('name', interpolatedName);
            };
        }
        return ngName;
    })();
    Directive.ngName = ngName;
})(Directive || (Directive = {}));
/// <reference path="../../scripts/typings/jqueryui/jqueryui.d.ts" />
/// <reference path="../../scripts/typings/jquery.ui.datetimepicker/jquery.ui.datetimepicker.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
var Directive;
(function (Directive) {
    var spDatetimePicker = (function () {
        function spDatetimePicker($parse) {
            this.restrict = "E";
            this.replace = true;
            this.transclude = false;
            this.compile = function (element, attrs) {
                var modelAccessor = $parse(attrs.ngModel);
                var newElem = angular.element("<input class='form-control' id ='dtpck' type='text'></input>");
                element.replaceWith(newElem);
                return function (scope, element, attrs) {
                    var processChange = function () {
                        var date = new Date(element.datepicker("getDate").toString());
                        scope.$apply(function (scope) {
                            // Change bound variable
                            modelAccessor.assign(scope, date);
                        });
                    };
                    var dtOptions = {};
                    if (attrs.dtOptions)
                        dtOptions = attrs.dtOptions;
                    dtOptions.dateFormat = 'mm/dd/yy';
                    dtOptions.onClose = processChange;
                    dtOptions.onSelect = processChange;
                    dtOptions.changeMonth = true;
                    dtOptions.changeYear = true;
                    dtOptions.showButtonPanel = true;
                    dtOptions.currentText = "Today";
                    if (attrs["minDay"])
                        dtOptions.minDate = true;
                    dtOptions.showAnim = "slide";
                    element.datepicker(dtOptions);
                    //scope.$watch(attrs.ngModel, function (newval, Oldval) {
                    //    alert("has changed" + newval + Oldval);
                    //})
                    scope.$watch(modelAccessor, function (val) {
                        var date = new Date(val);
                        element.datepicker("setDate", date);
                    });
                };
            };
        }
        return spDatetimePicker;
    })();
    Directive.spDatetimePicker = spDatetimePicker;
})(Directive || (Directive = {}));
var Authentication;
(function (Authentication) {
    "use strict";
    var AppBuilder = (function () {
        function AppBuilder(name) {
            this.app = angular.module(name, []);
            this.app.service('logedSites', ['$window', '$http', function ($window, $http) {
                return new Service.logedSites($window, $http);
            }]);
            this.app.service('AuthService', ['$window', '$http', '$q', '$location', 'logedSites', '$timeout', function ($window, $http, $q, $location, logedSites, $timeout) {
                return new Service.authService($window, $http, $q, $location, logedSites, $timeout);
            }]);
        }
        return AppBuilder;
    })();
    Authentication.AppBuilder = AppBuilder;
})(Authentication || (Authentication = {}));
new Authentication.AppBuilder('AuthenticationModule');
var Service;
(function (Service) {
    var authService = (function () {
        function authService($window, $http, $q, $location, logedSites, $timeout) {
            this.authentication = { isAuth: false, isAdmin: false, userName: "", roles: [], redirectTo: "" };
            var self = this;
            var _useRefreshTokens = true;
            var _clientId = "stepProcessor";
            var serviceBase = "/";
            var timeAboutToExpire = 60000;
            var secondToMilisecond = 1000;
            var diff = -1;
            var _refreshTokenTimeOut = {};
            var refreshTokenPromise;
            var pathThatRequireLogin = ["/form", ""];
            var domainParser = function (url) {
                var parser = document.createElement('a');
                parser.href = url;
                return parser.hostname;
            };
            var url_domain = function (data) {
                var a = document.createElement('a');
                a.href = data;
                return a.hostname;
            };
            this.requireLogin = function (path) {
                return pathThatRequireLogin.indexOf(path) >= 0;
            };
            this.fillAuthData = function () {
                var authData = null;
                var hostName = null;
                var url = serviceBase.match("^/") ? $location.absUrl() : serviceBase.match("^http") ? serviceBase : null;
                if (url)
                    hostName = url_domain(url);
                if (hostName)
                    authData = logedSites.authdata(hostName);
                //var authData = localStorageService.get('authorizationData');
                if (authData) {
                    if (!_refreshTokenTimeOut[hostName])
                        _refreshTokenTimer(new Date().getTime() - new Date(authData.tokenExpires).getTime() - timeAboutToExpire, hostName);
                    self.authentication.isAuth = true;
                    self.authentication.userName = authData.userName;
                    self.roles();
                }
            };
            this.saveRegistration = function (registration) {
                //_logOut();
                return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
                    return response;
                });
            };
            this.login = function (loginData) {
                var hostName = null;
                var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
                if (_useRefreshTokens) {
                    data = data + "&client_id=" + _clientId;
                }
                var deferred = $q.defer();
                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                    var url = serviceBase.match("^/") ? $location.absUrl() : serviceBase.match("^http") ? serviceBase : null;
                    if (url)
                        hostName = domainParser(url);
                    // Save the returned token for future use
                    //Add the host to the list of loged sites if does not exist
                    if (hostName && !logedSites.contain(hostName))
                        logedSites.add({ domain: hostName, token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshToken: true, tokenExpires: response['.expires'], roles: JSON.parse(response.roles) });
                    //If domain uses refreshtoken then start the refreshToken service
                    if (logedSites.authdata(hostName).useRefreshToken)
                        _refreshTokenTimer((response.expires_in * secondToMilisecond) - timeAboutToExpire, hostName);
                    //localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName });
                    self.authentication.roles = JSON.parse(response.roles);
                    self.authentication.isAuth = true;
                    self.authentication.userName = loginData.userName;
                    self.authentication.isAdmin = self.hasRole("1");
                    deferred.resolve(response);
                }).error(function (err, status) {
                    self.logOut("");
                    deferred.reject(err);
                });
                return deferred.promise;
            };
            this.roles = function () {
                self.authentication.isAdmin = false;
                $http.get("/api/account/roles").success(function (response) {
                    var roles = [];
                    self.authentication.roles = response.$values;
                    for (var i = 0; i < self.authentication.roles.length; i++) {
                        if (self.authentication.roles[i].id == '1') {
                            self.authentication.isAdmin = true;
                            break;
                        }
                    }
                }).error(function (err, status) {
                    self.logOut("");
                });
            };
            this.hasRole = function (role) {
                var hasrole = false;
                for (var i = 0; i < self.authentication.roles.length; i++) {
                    if (self.authentication.roles[i].id == role) {
                        hasrole = true;
                        break;
                    }
                    ;
                }
                return hasrole;
            };
            this.logOut = function (domain) {
                //If domain is undefined use ServiceBase
                var _domain = !domain ? serviceBase : domain;
                //If url starts with / its a relative route base on $location
                _domain = url_domain(_domain.match("^/") ? $location.absUrl() : _domain);
                //Remove domain & token from LogedSites
                if (_refreshTokenTimeOut[_domain])
                    $timeout.cancel(_refreshTokenTimeOut[_domain]);
                if (_domain)
                    logedSites.remove(_domain);
                self.authentication.isAuth = false;
                self.authentication.userName = "";
                self.authentication.isAdmin = false;
            };
            var _refreshTokenTimer = function (time, domain) {
                if (_refreshTokenTimeOut[domain])
                    $timeout.cancel(_refreshTokenTimeOut[domain]);
                _refreshTokenTimeOut[domain] = $timeout(function () {
                    var data = "grant_type=refresh_token&refresh_token=" + logedSites.authdata(domain).refreshToken + "&client_id=" + _clientId;
                    _refrehsTokenServerCall(data).success(function (response) {
                        var _newData = { domain: domain, token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshToken: true, tokenExpires: response['.expires'], roles: response.roles };
                        _setNewToken(domain, _newData);
                        _refreshTokenTimer((response.expires_in * secondToMilisecond) - timeAboutToExpire, domain);
                    });
                }, time);
            };
            this.refreshToken = function (domain) {
                var authData = null;
                var deferred = $q.defer();
                // if a refreshtoken service is running for this domain
                if (_refreshTokenTimeOut[domain]) {
                    deferred.resolve();
                }
                else {
                    if (domain)
                        authData = logedSites.authdata(domain);
                    if (authData && authData.useRefreshToken) {
                        var expirationTime = new Date(new Date(authData.tokenExpires).getTime() + diff * 60000).toISOString(); //Set expiration time a minute before token expire 
                        if (expirationTime <= new Date().toISOString()) {
                            if (!refreshTokenPromise) {
                                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + _clientId;
                                refreshTokenPromise = _refrehsTokenServerCall(data);
                            }
                            refreshTokenPromise.success(function (response) {
                                var _newData = { domain: domain, token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshToken: true, tokenExpires: response['.expires'], roles: response.roles };
                                _setNewToken(domain, _newData);
                                refreshTokenPromise = null;
                                deferred.resolve();
                            }).error(function () {
                                refreshTokenPromise = null;
                                deferred.resolve();
                            });
                        }
                        else
                            deferred.resolve();
                    }
                    else
                        deferred.resolve();
                }
                return deferred.promise;
            };
            function _setNewToken(domain, newData) {
                if (newData) {
                    var _userName = logedSites.authdata(domain).userName;
                    logedSites.remove(domain);
                    newData.userName = _userName;
                    logedSites.add(newData);
                    self.authentication.roles = JSON.parse(newData.roles);
                    self.authentication.isAdmin = self.hasRole("1");
                }
            }
            function _refrehsTokenServerCall(data) {
                return $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            }
        }
        return authService;
    })();
    Service.authService = authService;
})(Service || (Service = {}));
//AppoinmentApp.service('authService', ['$window', '$http', '$q', '$location','logedSites','$timeout', site.authService]);
var Service;
(function (Service) {
    var logedSites = (function () {
        function logedSites($window, $http) {
            var _this = this;
            var logSite = {};
            var logSites = [];
            this.add = function (logedSite) {
                var logedSites = JSON.parse($window.localStorage.getItem("logedSites"));
                if (!logedSites)
                    logedSites = [];
                logedSites.push(logedSite);
                $window.localStorage.setItem("logedSites", JSON.stringify(logedSites));
                logSites = JSON.parse($window.localStorage.getItem("logedSites"));
            };
            this.contain = function (domain) {
                var exist = false;
                var logedSites = JSON.parse($window.localStorage.getItem("logedSites"));
                if (logedSites) {
                    for (var i = 0; i < logedSites.length; i++) {
                        if (logedSites[i].domain === domain) {
                            exist = true;
                            break;
                        }
                        ;
                    }
                    ;
                }
                ;
                return exist;
            };
            this.token = function (domain) {
                var token = null;
                var logedSites = JSON.parse($window.localStorage.getItem("logedSites"));
                if (logedSites) {
                    for (var i = 0; i < logedSites.length; i++) {
                        if (logedSites[i].domain === domain) {
                            token = logedSites[i].token;
                            break;
                        }
                        ;
                    }
                    ;
                }
                ;
                return token;
            };
            this.authdata = function (domain) {
                var data = null;
                var logedSites = JSON.parse($window.localStorage.getItem("logedSites"));
                if (logedSites) {
                    for (var i = 0; i < logedSites.length; i++) {
                        if (logedSites[i].domain === domain) {
                            data = logedSites[i];
                            break;
                        }
                        ;
                    }
                    ;
                }
                ;
                return data;
            };
            this.remove = function (domain) {
                if (_this.contain(domain)) {
                    var node = null;
                    var logedSites = JSON.parse($window.localStorage.getItem("logedSites"));
                    if (logedSites) {
                        for (var i = logedSites.length - 1; i >= 0; i--) {
                            if (logedSites[i].domain === domain) {
                                node = i;
                                break;
                            }
                            ;
                        }
                        ;
                        logedSites.splice(node, 1);
                        $window.localStorage.setItem("logedSites", JSON.stringify(logedSites));
                        logSites = JSON.parse($window.localStorage.getItem("logedSites"));
                    }
                    ;
                }
            };
        }
        logedSites.$inject = ['$window', '$http'];
        return logedSites;
    })();
    Service.logedSites = logedSites;
})(Service || (Service = {}));
//AppoinmentApp.service('logedSites', ['$window', '$http', '$q', '$location', site.logedSites]);
var Service;
(function (Service) {
    var SettingsService = (function () {
        function SettingsService($scope, $windows) {
            $windows.scopes = $windows.scopes || [];
            $windows.scopes.push($scope);
            if (!$windows.SettingsService) {
                $windows.SettingsService = {
                    contactphone: "786 413 7596"
                };
            }
            this.contactphone = function () {
                return $windows.SettingsService.contactphone;
            };
            this.setcontactphone = function (phone) {
                $windows.SettingsService.contactphone = phone;
                angular.forEach($windows.scopes, function (_scope) {
                    if (!_scope.$$phase) {
                        _scope.$apply();
                    }
                });
            };
        }
        return SettingsService;
    })();
    Service.SettingsService = SettingsService;
})(Service || (Service = {}));
var SharedService;
(function (SharedService) {
    "use strict";
    var AppBuilder = (function () {
        function AppBuilder(name) {
            var _contactphone = "777 777 7777";
            var m = {
                contactPhone: function () {
                    return _contactphone;
                },
                changePhone: function (phone) {
                    _contactphone = phone;
                }
            };
            this.app = angular.module(name, ["ngRoute", "ngResource"]);
            this.app.provider('$Settings', ['$window', '$rootScope', SettingsProvider]);
        }
        return AppBuilder;
    })();
    SharedService.AppBuilder = AppBuilder;
    //interface IGreetingService {
    //    getGreeting: () => string;
    //}
    var SettingsProvider = (function () {
        function SettingsProvider() {
            var _contactphone = "777 777 7777";
            function _setContactPhone(contactphone) {
                _contactphone = contactphone;
            }
            ;
            this.$get = function ($window, $rootScope) {
                return { getContactPhone: function () {
                    return _contactphone;
                }, setContactPhone: _setContactPhone };
            };
        }
        return SettingsProvider;
    })();
    SharedService.SettingsProvider = SettingsProvider;
})(SharedService || (SharedService = {}));
/// <reference path="../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="app.ts" />
new StepProcessor.AppBuilder('StepProcessorApp');
//new head.AppBuilder('headApp');  
//new SharedService.AppBuilder("SharedService");
//angular.bootstrap(document.getElementById("StepProcessorApp"), ['StepProcessorApp']); 
//# sourceMappingURL=mainapp.js.map