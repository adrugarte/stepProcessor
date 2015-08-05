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
                }, function () {
                    call.reject();
                });
                return call.promise;
            };
            var mainRoute = {
                controller: 'mainCtrl',
                templateUrl: '/App/View/index.html',
                resolve: {
                    'content': function (Resolver) {
                        return Resolver.mainCtrl();
                    }
                }
            };
            var formRoute = {
                controller: 'formCtrl',
                templateUrl: '/App/View/Form.html',
                resolve: {
                    "template": function ($q, $http, $templateCache) {
                        return loadtemplates($q, $http, $templateCache);
                    }
                }
            };
            var config = function ($routeProvider, $locationProvider, $httpProvider) {
                $routeProvider.when('/', mainRoute).when('/form', formRoute).when('/image', { templateUrl: '/App/View/imagetest.html' }).when('/login', { controller: 'logonCtrl', templateUrl: '/App/View/login.html' }).otherwise({ redirectTo: '/' });
                $httpProvider.interceptors.push('AuthInterceptorService');
                $locationProvider.html5Mode(true);
            };
            //var routechangeevent = ($rootScope: ng.IScope, $location: ng.ILocationService, authService: Service.IauthService) => {
            //    $rootScope.$on('$routeChangeStart',(event, next, current) => {
            //        if (authService.requireLogin(next.$$route.originalPath) && authService.authentication.isAuth !== true) {
            //            event.preventDefault();
            //            alert("Please login before continue");
            //        }
            //    });
            //};
            //var loadtemplates = ($http: ng.IHttpService, $templateCache:ng.ITemplateCacheService) => {
            //    $http.get('App/templates/templates.html').success(function (response:any) {
            //        $templateCache.put('datetimepicker.html', response);
            //    });
            //}
            //// Run
            //this.app.run(['$rootScope', '$location','authService', routechangeevent]);
            this.app.constant("moment", moment);
            //// Config
            this.app.config(['$routeProvider', '$locationProvider', '$httpProvider', config]);
            //// Services
            this.app.service('Resolver', ['$q', function ($q) {
                return new Service.Resolver($q);
            }]);
            this.app.service('AuthInterceptorService', ['$q', '$location', '$injector', 'settingService', function ($q, $location, $injector, settingService) {
                return new Service.CallBackInterceptorService($q, $location, $injector, settingService);
            }]);
            this.app.factory('ServerCall', function ($resource) {
                return new Service.ServerCall($resource);
            });
            this.app.service('logedSites', ['$window', '$http', function ($window, $http) {
                return new Service.logedSites($window, $http);
            }]);
            this.app.service('settingService', ['$rootScope', '$window', function ($rootScope, $window) {
                return new Service.settingService();
            }]);
            this.app.service('authService', ['$window', '$http', '$q', '$location', 'logedSites', '$timeout', function ($window, $http, $q, $location, logedSites, $timeout) {
                return new Service.authService($window, $http, $q, $location, logedSites, $timeout);
            }]);
            this.app.service('Uploader', function ($http) {
                return new Service.Uploader($http);
            });
            ///// Directives
            this.app.directive('bsInit', function ($parse) {
                return new Directive.bsInit($parse);
            });
            this.app.directive('fileModel', function ($parse) {
                return new Directive.fileModel($parse);
            });
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
            this.app.directive('uploadFileList', ['ServerCall', function (ServerCall) {
                return new Directive.DocumentList(ServerCall);
            }]);
            ///// Controllers
            this.app.controller('headCtrl', ['$scope', 'settingService', '$rootScope', function ($scope, settingService, $rootScope) { return new head.headCtrl($scope, settingService, $rootScope); }]);
            this.app.controller('formCtrl', function ($scope, moment, $location, authService, Uploader, template) { return new Controller.formCtrl($scope, moment, $location, authService, Uploader, template); });
            this.app.controller('mainCtrl', function ($scope, $location, authService, Uploader, content) { return new Controller.mainCtrl($scope, $location, authService, Uploader, content); });
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
var Controller;
(function (Controller) {
    var formCtrl = (function () {
        function formCtrl($scope, moment, $location, authService, Uploader, template) {
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
    Controller.formCtrl = formCtrl;
})(Controller || (Controller = {}));
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
        function mainCtrl($scope, $location, authService, Uploader, Popovercontent) {
            var self = this;
            self.scope = $scope;
            self.scope.myFile = [];
            self.scope.popover = {};
            //self.scope.settings = SettingsService;
            self.scope.authService = authService;
            self.scope.logData = { password: '', userName: '' };
            self.scope.authService.authentication.userName;
            self.scope.popover["OnlineServices"] = { placement: "bottom", trigger: "hover" };
            self.scope.popover["OnlineServices"]["content"] = Popovercontent['content'];
            self.scope.login = function () {
                authService.login($scope.logData).then(function (response) {
                    if (authService.authentication.redirectTo.length > 0)
                        $location.path(authService.authentication.redirectTo);
                    //console.log("Redirection from: " + authService.authentication.redirectTo);
                    authService.authentication.redirectTo = "";
                }, function (err) {
                    alert("El inicio de sesion ha fallado, las credenciales no son validas");
                });
                self.scope.logData = { password: "", userName: "" };
            };
            //self.scope.upload = () => {
            //    var files = self.scope.myFile;
            //    var uploadUrl = 'http://www.example.com/images';
            //    fileUpload.uploadFileToUrl(files, uploadUrl);
            //}
            //self.scope.alertSomething = function () {
            //    // The .open() method returns a promise that will be either
            //    // resolved or rejected when the modal window is closed.
            //    var promise = modals.open("alert",
            //        {
            //            message: "I think you are kind of beautiful!"
            //        },false);
            //    promise.then(
            //        function handleResolve(response) {
            //            console.log("Alert resolved.");
            //        },
            //        function handleReject(error) {
            //            console.warn("Alert rejected!");
            //        }
            //        );
            //};
        }
        return mainCtrl;
    })();
    Controller.mainCtrl = mainCtrl;
})(Controller || (Controller = {}));
var Controller;
(function (Controller) {
    var AlertModalView = (function () {
        function AlertModalView($scope, modals) {
            var self = this;
            self.scope = $scope;
            // Setup default values using modal params.
            self.scope.message = (modals.params().message || "Whoa!");
            // ---
            // PUBLIC METHODS.
            // ---
            // Wire the modal buttons into modal resolution actions.
            self.scope.close = modals.resolve;
            self.scope.jumpToConfirm = function () {
                // We could have used the .open() method to jump from one modal
                // to the next; however, that would have implicitly "rejected" the
                // current modal. By using .proceedTo(), we open the next window, but
                // defer the resolution of the current modal until the subsequent
                // modal is resolved or rejected.
                modals.proceedTo("confirm", {
                    message: "I just came from Alert - doesn't that blow your mind?",
                    confirmButton: "Eh, maybe a little",
                    denyButton: "Oh please"
                }).then(function handleResolve() {
                    console.log("Piped confirm resolved.");
                }, function handleReject() {
                    console.warn("Piped confirm rejected.");
                });
            };
        }
        return AlertModalView;
    })();
    Controller.AlertModalView = AlertModalView;
})(Controller || (Controller = {}));
var Directive;
(function (Directive) {
    var bindModalView = (function () {
        function bindModalView($rootScope, modals) {
            this.link = function (scope, element, attrs) {
                // I define which modal window is being rendered. By convention,
                // the subview will be the same as the type emitted by the modals
                // service object.
                scope.subview = null;
                // If the user clicks directly on the backdrop (ie, the modals
                // container), consider that an escape out of the modal, and reject
                // it implicitly.
                element.on("click", function handleClickEvent(event) {
                    if (element[0] !== event.target) {
                        return;
                    }
                    scope.$apply(modals.reject);
                });
                // Listen for "open" events emitted by the modals service object.
                $rootScope.$on("modals.open", function handleModalOpenEvent(event, modalType) {
                    scope.subview = modalType;
                });
                // Listen for "close" events emitted by the modals service object.
                $rootScope.$on("modals.close", function handleModalCloseEvent(event) {
                    scope.subview = null;
                });
            };
        }
        return bindModalView;
    })();
    Directive.bindModalView = bindModalView;
})(Directive || (Directive = {}));
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
    var fileModel = (function () {
        function fileModel($parse) {
            this.restrict = 'A';
            this.link = function (scope, element, attrs) {
                var fileModel = $parse(attrs['fileModel'] + ".file");
                var modelSetter = fileModel.assign;
                var fileNameModel = $parse(attrs['fileModel'] + ".OriginalName");
                var nameSetter = fileNameModel.assign;
                element.bind('change', function () {
                    //var files = fileArray(scope);
                    var file = element[0].files[0];
                    //angular.forEach(element[0].files, function (file) {
                    //    var fileObj: Models.IFileToUpload = { Id: element[0].id, File: { id: element[0].id, name:"" , file: file }, Decription:"", Type:"" };
                    //    files.push(fileObj);
                    //})
                    scope.Adding = true;
                    scope.$apply(function () {
                        nameSetter(scope, file.name);
                        modelSetter(scope, file);
                    });
                });
            };
        }
        return fileModel;
    })();
    Directive.fileModel = fileModel;
    var bsInit = (function () {
        function bsInit($parse) {
            this.link = function (scope, element, attrs) {
                var options = {};
                var bsInit = attrs['bsInit'];
                if (bsInit)
                    options = $parse(bsInit)(scope);
                element.popover(options);
            };
        }
        return bsInit;
    })();
    Directive.bsInit = bsInit;
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
var Directive;
(function (Directive) {
    var DocumentList = (function () {
        function DocumentList(ServerCall) {
            this.templateUrl = "App/Templates/uploadlist.html";
            this.scope = {};
            this.restrict = 'EA';
            this.replace = true;
            this.controller = DocumenListController;
            this.link = function (scope, elm, attr) {
                scope.documentList = [];
                scope.Adding = false;
                scope.documentType = [
                    { Id: "type-1", TypeDesc: "Pasaporte" },
                    { Id: "type-2", TypeDesc: "Social Security" },
                    { Id: "type-3", TypeDesc: "Residencia" },
                    { Id: "type-4", TypeDesc: "Otro" },
                ];
                scope.upload = function () {
                    var fd = new FormData();
                    angular.forEach(scope.file, function (value, key) {
                        if (key == "Type") {
                            fd.append("TypeId", value["Id"]);
                            fd.append("TypeDesc", value["TypeDesc"]);
                        }
                        else
                            fd.append(key, value);
                    });
                    ServerCall.File.upload(fd, function (response) {
                        scope.documentList.push(response);
                    }, function (error) {
                        alert("error while saving" + error);
                    });
                    scope.file = { Type: null, OriginalName: "", Label: "", file: null };
                };
                scope.remove = function (idx) {
                    ServerCall.Document.delete({ id: scope.documentList[idx].Id }, function (response) {
                        scope.documentList.slice(idx, 1);
                    }, function (error) {
                        alert("error while deleting" + error);
                    });
                };
            };
        }
        return DocumentList;
    })();
    Directive.DocumentList = DocumentList;
    var DocumenListController = (function () {
        function DocumenListController($element, $scope, ServerCall) {
            this.$element = $element;
            this.$scope = $scope;
            ServerCall.Document.query().$promise.then(function (response) {
                $scope.documentList = response;
            }, function (error) {
                $scope.documentList = [];
            });
        }
        DocumenListController.$inject = ['$element', '$scope', 'ServerCall'];
        return DocumenListController;
    })();
    Directive.DocumenListController = DocumenListController;
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
    var CallBackInterceptorService = (function () {
        function CallBackInterceptorService($q, $location, $injector, settingService) {
            function url_domain(data) {
                var a = document.createElement('a');
                a.href = data;
                return a.hostname;
            }
            this.request = function (config) {
                if (config.url.match("^/token|.html"))
                    return config; //|| config.url.match("$.html")
                var deferred = $q.defer();
                //console.info("Token is Refreshing.? " + IsTokenRefreshing + " | " + config.url)
                config.headers = config.headers || {};
                //if its an api call we check for a ApiBaseURL, it returns something only in case Api is hosted in a diferent site
                if (config.url.match("^/api"))
                    config.url = settingService.apiBaseUrl("") + config.url;
                // if url starts with / then use $location.absUrl() to get domain
                var domain = (config.url.match("^/")) ? $location.absUrl() : (config.url.match("^http") ? config.url : null);
                // if there is a valid URL
                if (domain)
                    domain = url_domain(domain);
                var logedSites = $injector.get('logedSites');
                // Check if token exist for the domain and refresh it
                if (domain && logedSites.contain(domain) && logedSites.authdata(domain).useRefreshToken) {
                    var authService = $injector.get('authService');
                    authService.refreshToken(domain).then(function () {
                        config.headers.Authorization = 'Bearer ' + logedSites.authdata(domain).token;
                        deferred.resolve(config);
                    });
                }
                else
                    deferred.resolve(config);
                config.domain = domain;
                return deferred.promise;
            };
            this.responseError = function (rejection) {
                if (rejection.status === 401) {
                    var authService = $injector.get('authService');
                    authService.logOut("");
                    $location.path('/login');
                }
                return $q.reject(rejection);
            };
        }
        CallBackInterceptorService.$inject = ['$q', '$location', '$injector', 'settingService'];
        return CallBackInterceptorService;
    })();
    Service.CallBackInterceptorService = CallBackInterceptorService;
})(Service || (Service = {}));
//AppoinmentApp.service('AuthInterceptorService', ['$q', '$location', '$injector', 'settingService', site.authInterceptorService]);
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
    var modalWindowService = (function () {
        function modalWindowService($rootScope, $q) {
            var _this = this;
            var modal = { deferred: null, params: null };
            this.open = function (type, params, pipeResponse) {
                var previousDeferred = modal.deferred;
                // Setup the new modal instance properties.
                modal.deferred = $q.defer();
                modal.params = params;
                // We're going to pipe the new window response into the previous
                // window's deferred value.
                if (previousDeferred && pipeResponse) {
                    modal.deferred.promise.then(previousDeferred.resolve, previousDeferred.reject);
                }
                else if (previousDeferred) {
                    previousDeferred.reject();
                }
                // Since the service object doesn't (and shouldn't) have any direct
                // reference to the DOM, we are going to use events to communicate
                // with a directive that will help manage the DOM elements that
                // render the modal windows.
                // --
                // NOTE: We could have accomplished this with a $watch() binding in
                // the directive; but, that would have been a poor choice since it
                // would require a chronic watching of acute application events.
                $rootScope.$emit("modals.open", type);
                return (modal.deferred.promise);
            };
            // I return the params associated with the current params.
            this.params = function () {
                return (modal.params || {});
            };
            // I open a modal window with the given type and pipe the new window's
            // response into the current window's response without rejecting it
            // outright.
            // --
            // This is just a convenience method for .open() that enables the
            // pipeResponse flag; it helps to make the workflow more intuitive.
            this.proceedTo = function (type, params) {
                return (_this.open(type, params, true));
            };
            // I reject the current modal with the given reason.
            this.reject = function (reason) {
                if (!modal.deferred) {
                    return;
                }
                modal.deferred.reject(reason);
                modal.deferred = modal.params = null;
                // Tell the modal directive to close the active modal window.
                $rootScope.$emit("modals.close");
            };
            // I resolve the current modal with the given response.
            this.resolve = function (response) {
                if (!modal.deferred) {
                    return;
                }
                modal.deferred.resolve(response);
                modal.deferred = modal.params = null;
                // Tell the modal directive to close the active modal window.
                $rootScope.$emit("modals.close");
            };
        }
        return modalWindowService;
    })();
    Service.modalWindowService = modalWindowService;
})(Service || (Service = {}));
var Service;
(function (Service) {
    var ServerCall = (function () {
        function ServerCall($resource) {
            var uploadDescriptor = { method: "POST", isArray: false, transformRequest: angular.identity, headers: { 'Content-Type': undefined } };
            this.Document = $resource('/api/document/:id', { id: '@id' });
            this.File = $resource('/api/file', {}, { upload: uploadDescriptor });
        }
        return ServerCall;
    })();
    Service.ServerCall = ServerCall;
})(Service || (Service = {}));
var Service;
(function (Service) {
    var settingService = (function () {
        function settingService() {
            var _apiBaseUrl = "";
            this.apiBaseUrl = function (url) {
                if (url)
                    _apiBaseUrl = url;
                return _apiBaseUrl;
            };
        }
        return settingService;
    })();
    Service.settingService = settingService;
})(Service || (Service = {}));
var Service;
(function (Service) {
    "use strict";
    var Resolver = (function () {
        function Resolver($q) {
            this.mainCtrl = function () {
                var deferred = $q.defer();
                $.getJSON("App/Texts/OnlineServices.json", function (jsondata) {
                    deferred.resolve(jsondata);
                });
                return deferred.promise;
            };
        }
        return Resolver;
    })();
    Service.Resolver = Resolver;
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
    Service.SettingsProvider = SettingsProvider;
})(Service || (Service = {}));
var Service;
(function (Service) {
    var Uploader = (function () {
        function Uploader($http) {
            this.uploadFileToUrl = function (files, uploadUrl) {
                var fd = new FormData();
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    fd.append('file', file);
                    $http.post(uploadUrl, fd, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    }).success(function (response) {
                        alert("It worked");
                    }).error(function () {
                        alert("It didn't work");
                    });
                }
            };
        }
        return Uploader;
    })();
    Service.Uploader = Uploader;
})(Service || (Service = {}));
/// <reference path="../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="app.ts" />
new StepProcessor.AppBuilder('StepProcessorApp');
//new head.AppBuilder('headApp');  
//new SharedService.AppBuilder("SharedService");
//angular.bootstrap(document.getElementById("StepProcessorApp"), ['StepProcessorApp']); 
//# sourceMappingURL=mainapp.js.map