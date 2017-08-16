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
            var serviceRoute = {
                controller: 'serviceCtrl',
                templateUrl: '/App/View/serviceview.html'
            };
            var messageRoute = {
                controller: 'messageCtrl',
                templateUrl: '/App/View/messageview.html',
            };
            var textRoute = {
                controller: 'messageCtrl',
                templateUrl: '/App/View/textview.html',
            };
            var config = function ($routeProvider, $locationProvider, $httpProvider) {
                $routeProvider.when('/', mainRoute).when('/customer/:id', customerRoute).when('/service/:id', serviceRoute).when('/message', messageRoute).when('/textmessage', textRoute).otherwise({ redirectTo: '/' });
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
            this.app.directive('message', ['Callback', '$compile', '$http', function (Callback, $compile, $http) {
                return new Directive.message(Callback, $compile, $http);
            }]);
            //this.app.directive('onlyNumber', [() => { return new Directive.OnlyNumber(); }]);
            ///// Controllers
            this.app.controller('customerCtrl', ['$scope', 'Callback', 'Utils', '$routeParams', '$location', function ($scope, Callback, Utils, $routeParams, $location) { return new Controller.customer($scope, Callback, Utils, $routeParams, $location); }]);
            this.app.controller('mainCtrl', ['$scope', 'Callback', 'Utils', '$routeParams', function ($scope, Callback, Utils, $routeParams) { return new Controller.main($scope, Callback, Utils, $routeParams); }]);
            this.app.controller('serviceCtrl', ['$scope', 'Callback', 'Utils', '$routeParams', function ($scope, Callback, Utils, $routeParams) { return new Controller.service($scope, Callback, Utils, $routeParams); }]);
            this.app.controller('messageCtrl', ['$scope', 'Callback', 'Utils', function ($scope, Callback, Utils) { return new Controller.messageCtrl($scope, Callback, Utils); }]);
        }
        return AppBuilder;
    })();
    Admin.AppBuilder = AppBuilder;
})(Admin || (Admin = {}));
new Admin.AppBuilder('AdminApp');
angular.bootstrap($('body'), ['AdminApp']);
var Controller;
(function (Controller) {
    var customer = (function () {
        function customer(scope, Callback, Utils, $routeParams, $location) {
            var self = this;
            self.scope = scope;
            self.scope.customerId = parseInt($routeParams["id"]);
            self.scope.person = {};
            self.scope.person.addresses = [];
            self.scope.person.contacts = [];
            self.scope.address = {};
            self.scope.phone = {};
            self.scope.celular = {};
            self.scope.email = {};
            self.scope.personQuery = {};
            self.scope.customerSources = Utils.Sources;
            var getCustomer = function () {
                Callback.Person.get({ id: self.scope.customerId }, function (response) {
                    self.scope.person = response.person;
                    if (self.scope.person.addresses)
                        self.scope.address = self.scope.person.addresses[0];
                    if (self.scope.person.contacts) {
                        self.scope.phone = getContact("1");
                        self.scope.celular = getContact("2");
                        self.scope.email = getContact("3");
                    }
                });
            };
            var setContacts = function () {
                self.scope.person.addresses = [];
                self.scope.person.contacts = [];
                if (self.scope.address && (self.scope.address.address1 || self.scope.address.address2 || self.scope.address.city || self.scope.address.zipCode)) {
                    self.scope.address.type = "Home";
                    if (!self.scope.person.addresses)
                        self.scope.person.addresses = [];
                    self.scope.person.addresses.push(self.scope.address);
                }
                if (self.scope.phone.value) {
                    self.scope.phone.type = 'Phone';
                    self.scope.phone.use = 'Private'; //private
                    if (!self.scope.person.contacts)
                        self.scope.person.contacts = [];
                    self.scope.person.contacts.push(self.scope.phone);
                }
                if (self.scope.celular.value) {
                    self.scope.celular.type = 'Cellular';
                    self.scope.celular.use = 'Private'; //private
                    if (!self.scope.person.contacts)
                        self.scope.person.contacts = [];
                    self.scope.person.contacts.push(self.scope.celular);
                }
                if (self.scope.email.value) {
                    self.scope.email.type = 'Email';
                    self.scope.email.use = 'Private'; //private
                    if (!self.scope.person.contacts)
                        self.scope.person.contacts = [];
                    self.scope.person.contacts.push(self.scope.email);
                }
            };
            var getContact = function (contacttype) {
                var i;
                for (i = 0; i < self.scope.person.contacts.length; i++) {
                    if (self.scope.person.contacts[i].type == contacttype)
                        return self.scope.person.contacts[i];
                }
                return {};
            };
            self.scope.saveCustomer = function () {
                setContacts();
                if (self.scope.person.id) {
                    Callback.Person.update(self.scope.person, function (person) {
                        alert("Datos Guardados ");
                    }, function (Error) {
                        alert('Han ocurrido errores al guardar los datos');
                    });
                }
                else {
                    Callback.Person.save(self.scope.person, function (result) {
                        self.scope.person = result;
                        self.scope.customerId = result.id;
                        $location.path("/customer/" + self.scope.customerId);
                        alert("Datos Guardados ");
                    }, function (Error) {
                        alert('Han ocurrido errores al guardar los datos');
                    });
                }
            };
            if (self.scope.customerId != 0)
                getCustomer();
        }
        return customer;
    })();
    Controller.customer = customer;
})(Controller || (Controller = {}));
var Controller;
(function (Controller) {
    var main = (function () {
        function main(scope, Callback, Utils, $routeParams) {
            scope.currentListPage = $routeParams["page"] ? $routeParams["page"] : 0;
            scope.query = $routeParams["query"] ? $routeParams["query"] : "";
            //self.scope.personQuery = {};
            ////self.scope.customerList = resolver['persons'];
            //self.scope.getCustomerList = () => {
            //    Callback.Person.query({ query: self.scope.personQuery, top: 50, offset: 0 }).$promise.
            //        then((response) => {
            //        self.scope.customerList = response;
            //    },
            //        (error) => {
            //            alert("Error:Somenthing went wrong");
            //        });
            //}
            //scope.getCustomerList();
        }
        return main;
    })();
    Controller.main = main;
})(Controller || (Controller = {}));
var Controller;
(function (Controller) {
    var messageCtrl = (function () {
        function messageCtrl(scope, Callback, Utils) {
        }
        return messageCtrl;
    })();
    Controller.messageCtrl = messageCtrl;
})(Controller || (Controller = {}));
var Controller;
(function (Controller) {
    var service = (function () {
        function service(scope, Callback, Utils, $routeParams) {
            var self = this;
            self.scope = scope;
            self.scope.service = {};
            self.scope.routeParam = $routeParams;
            if (self.scope.routeParam.id && self.scope.routeParam.id > 0) {
                Callback.PersonService.get({ id: self.scope.routeParam.id }).$promise.then(function (service) {
                    self.scope.service = service;
                });
            }
            else if (self.scope.routeParam.customer) {
                Callback.Person.get({ id: self.scope.routeParam.customer }).$promise.then(function (customer) {
                    self.scope.service.personId = parseInt(customer.person.id);
                    self.scope.service.personName = customer.person.lastName + ", " + customer.person.firstName;
                }, function (error) {
                });
            }
            self.scope.services = Callback.Service.query();
            self.scope.save = function () {
                Callback.PersonService.save(self.scope.service).$promise.then(function (response) {
                    alert("Data Saved");
                }, function (error) {
                    alert("Data Error");
                });
            };
            self.scope.setPrice = function () {
                scope.service['Price'] = getService(self.scope.service['Id']).price;
            };
            var getService = function (id) {
                for (var i = 0; i < scope.services.length; ++i) {
                    if (scope.services[i]['id'] == id)
                        return scope.services[i];
                }
                return null;
            };
        }
        return service;
    })();
    Controller.service = service;
})(Controller || (Controller = {}));
var Directive;
(function (Directive) {
    var OnlyNumber = (function () {
        function OnlyNumber() {
            this.link = function (scope, elm, attr) {
                $(elm).numeric();
            };
        }
        return OnlyNumber;
    })();
    Directive.OnlyNumber = OnlyNumber;
    var phoneInput = (function () {
        function phoneInput($filter, $browser) {
            this.require = 'ngModel';
            this.link = function ($scope, $element, $attrs, ngModelCtrl) {
                var listener = function () {
                    var value = $element.val().replace(/[^0-9]/g, '');
                    $element.val($filter('phonenumber')(value, false));
                };
                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function (viewValue) {
                    return viewValue.replace(/[^0-9]/g, '').slice(0, 10);
                });
                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    $element.val($filter('phonenumber')(ngModelCtrl.$viewValue, false));
                };
                $element.bind('change', listener);
                $element.bind('keydown', function (event) {
                    var key = event.keyCode;
                    // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                    // This lets us support copy and paste too
                    if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
                        return;
                    }
                    $browser.defer(listener); // Have to do this or changes don't get picked up properly
                });
                $element.bind('paste cut', function () {
                    $browser.defer(listener);
                });
            };
        }
        return phoneInput;
    })();
    Directive.phoneInput = phoneInput;
})(Directive || (Directive = {}));
var Directive;
(function (Directive) {
    var customerList = (function () {
        function customerList(Callback, $compile) {
            var _this = this;
            this.replace = true;
            this.scope = { page: '@' };
            this.templateUrl = "App/view/customerList.html";
            this.controller = customerListController;
            this.link = function (scope, elm, attr) {
                var self = _this;
                //self.scope = scope;
                scope.personQuery = "";
                var getCustomerList = function () {
                    Callback.Person.get({ query: scope.personQuery, top: scope.top, offset: (scope.page * scope.top) }).$promise.then(function (response) {
                        scope.productCounter = response.counter;
                        scope.customerList = response.persons;
                        scope.limit = ((scope.page * scope.top) + scope.top) > response.counter ? response.counter - (scope.page * scope.top) : scope.top;
                    });
                };
                scope.search = function () {
                    getCustomerList();
                    //$location.search("query", !scope.personQuery ? "" : scope.personQuery);
                    //$location.search("page", scope.page);
                };
                scope.showServices = function (idx, event) {
                    var element = angular.element(event.target).closest("div.customer-line");
                    if (!(element.attr("shown") == "true")) {
                        var PersonId = scope.customerList[idx].id;
                        var content = "<div>" + "<person-service-list person-id ='" + PersonId + "'/>" + "</div>";
                        element.after($compile(content)(scope));
                    }
                    else {
                        element.next().remove();
                    }
                    element.attr("shown", element.attr("shown") == "true" ? "false" : "true");
                };
                scope.next = function () {
                    if ((scope.page * scope.top) + scope.top < scope.productCounter) {
                        scope.page = (scope.page * 1) + 1;
                        getCustomerList();
                    }
                };
                scope.prev = function () {
                    if (scope.page > 0) {
                        scope.page = (scope.page * 1) - 1; //Tuve q multiplicar por uno xq lo estaba trando como cadena y lo concatenaba
                        getCustomerList();
                    }
                };
                scope.search();
            };
        }
        return customerList;
    })();
    Directive.customerList = customerList;
    var customerListController = (function () {
        function customerListController($element, $scope, ServerCall) {
            this.$element = $element;
            this.$scope = $scope;
            $scope.page = parseInt($scope.page.toString());
            $scope.top = 10;
        }
        customerListController.$inject = ['$element', '$scope', 'Callback'];
        return customerListController;
    })();
    Directive.customerListController = customerListController;
})(Directive || (Directive = {}));
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
                        if (!element.datepicker("getDate"))
                            return;
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
                    if (attrs["minDate"])
                        dtOptions.minDate = attrs["minDate"];
                    if (attrs["maxDate"])
                        dtOptions.maxDate = attrs["maxDate"];
                    if (attrs["yearRange"])
                        dtOptions.yearRange = attrs["yearRange"];
                    dtOptions.showAnim = "slide";
                    element.datepicker(dtOptions);
                    //scope.$watch(attrs.ngModel, function (newval, Oldval) {
                    //    alert("has changed" + newval + Oldval);
                    //})
                    scope.$watch(modelAccessor, function (val) {
                        if (!val)
                            return;
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
    var message = (function () {
        function message(Callback, $compile, $http) {
            var _this = this;
            this.scope = { via: '@' };
            this.replace = true;
            this.templateUrl = "App/view/messageTemplate.html";
            this.link = function (scope, elm, attr) {
                var self = _this;
                scope.message = "";
                scope.customerList = Callback.Person.query();
                scope.selectall = function (event) {
                    for (var i = 0; i < scope.customerList.length; i++) {
                        scope.customerList[i].selected = event.target.checked;
                    }
                };
                scope.birthday = function () {
                    $http.get("api/birthdaygreeting");
                };
                scope.send = function () {
                    //if (scope.message.length > 0) {
                    //    var message: FormData = new FormData();
                    //    message.append("subject", scope.subject);
                    //    message.append("text",scope.message);
                    //    var customers = [];
                    //    for (var i = 0; i < scope.customerList.length; i++) {
                    //        if (scope.customerList[i].selected) customers.push(scope.customerList[i]);
                    //    }
                    //    //message.customers = ;
                    //    if (customers.length == 0)
                    //        alert("Customer should be selected from the list");
                    //    else {
                    //        message.append("customers", customers);
                    //        message.append("attachment", scope.attachment.files[0]);
                    //        $("#loaderDiv").show();
                    //        Callback.Communication.sendfile(message,(data) => {
                    //            $("#loaderDiv").hide();
                    //            alert("Message Sent");
                    //            CleanCustomerList();
                    //        },() => { $("#loaderDiv").hide(); });
                    //    }
                    //}
                    if (scope.message.length > 0) {
                        var message = {};
                        message.subject = scope.subject;
                        message.text = scope.message;
                        message.via = scope.via;
                        message.includeVcard = scope.includeVcard;
                        message.customers = [];
                        for (var i = 0; i < scope.customerList.length; i++) {
                            if (scope.customerList[i].selected)
                                message.customers.push(scope.customerList[i]);
                        }
                        //message.customers = ;
                        if (message.customers.length == 0)
                            alert("Customer should be selected from the list");
                        else {
                            $("#loaderDiv").show();
                            Callback.Communication.save(message, function (data) {
                                $("#loaderDiv").hide();
                                if (typeof data.errormessage != 'undefined' && data.errormessage.length > 0)
                                    alert("The message was sent. Some issues happened." + data.errormessage);
                                else
                                    alert("Message sent.");
                                //CleanCustomerList();
                            }, function () {
                                $("#loaderDiv").hide();
                                alert("Error while sent message");
                            });
                        }
                    }
                };
                //var IsInSelectedCustomers = (id) => {
                //    if (typeof scope.selectedCustomerList != 'undefined'){
                //        for (var i = 0, len = scope.selectedCustomerList.length; i < len; i++) {
                //            if (scope.selectedCustomerList[i].id == id) return i;
                //        }
                //    }
                //    return -1;
                //}
                var CleanCustomerList = function () {
                    for (var i = 0; i < scope.customerList.length; i++) {
                        scope.customerList[i].selected = false;
                    }
                };
            };
        }
        return message;
    })();
    Directive.message = message;
})(Directive || (Directive = {}));
var Directive;
(function (Directive) {
    var personServiceList = (function () {
        function personServiceList(Callback, window) {
            var _this = this;
            this.replace = true;
            this.scope = { personId: '=' };
            this.templateUrl = "App/view/personServiceList.html";
            this.link = function (scope, elm) {
                var self = _this;
                scope.personServiceList = [];
                //self.scope = scope;
                scope.services = Callback.Service.query();
                var getServicePrice = function (id) {
                    var price = 0;
                    for (var i = 0; i < scope.services.length; ++i) {
                        if (scope.services[i]['id'] == id)
                            price = scope.services[i]['price'];
                    }
                    return price;
                };
                var getService = function (id) {
                    for (var i = 0; i < scope.services.length; ++i) {
                        if (scope.services[i]['id'] == id)
                            return scope.services[i];
                    }
                    return null;
                };
                scope.Delete = function (idx) {
                    if (window.confirm("Are you sure to delete this service?")) {
                        Callback.PersonService.delete({ id: scope.personServiceList[idx]['id'] }).$promise.then(function (response) {
                            scope.personServiceList.splice(idx, 1);
                        });
                    }
                };
                //scope.Cancel = (idx) => {
                //    scope.personServiceList[idx].$rollbackViewValue();
                //}
                scope.Close = function (idx) {
                    if (window.confirm("Are you sure to close the service " + scope.personServiceList[idx].serviceDesc + "?")) {
                        scope.personServiceList[idx].finished = new Date().toLocaleString();
                        Callback.PersonService.save(scope.personServiceList[idx]);
                    }
                };
                scope.Add = function () {
                    if (!scope.newservice || !scope.newservice['Id'])
                        return;
                    var pservice = {};
                    var service = getService(scope.newservice['Id']);
                    pservice.serviceDesc = service.serviceDesc;
                    pservice.price = scope.newservice['Price'] != null ? scope.newservice['Price'] : service.price;
                    pservice.form = service.form;
                    pservice.personId = scope.personId;
                    pservice.PaidAmount = scope.newservice['Paid'];
                    pservice.serviceId = service.id;
                    Callback.PersonService.save(pservice).$promise.then(function (response) {
                        scope.personServiceList.push(response);
                        scope.newservice = {};
                    });
                };
                scope.setPrice = function () {
                    scope.newservice['Price'] = getService(scope.newservice['Id']).price;
                };
                scope.Save = function (idx) {
                    scope.personServiceList[idx];
                    Callback.PersonService.save(scope.personServiceList[idx]).$promise.then(function () {
                        scope.editing = false;
                    });
                };
                var getPersonServiceList = function () {
                    if (!scope.personId)
                        scope.personId = -1;
                    Callback.PersonService.query({ PersonId: scope.personId }).$promise.then(function (response) {
                        scope.personServiceList = response;
                    });
                };
                scope.search = function () {
                    getPersonServiceList();
                };
                scope.search();
            };
        }
        return personServiceList;
    })();
    Directive.personServiceList = personServiceList;
})(Directive || (Directive = {}));
var Filters;
(function (Filters) {
    var forPhone = (function () {
        function forPhone() {
            this.filter = function (phone) {
                ///*
                //@param {Number | String } number - Number that will be formatted as telephone number
                //Returns formatted number: (###) ###-####
                //if number.length < 4: ###
                //    umber.length < 7: (###) ###
                //Does not handle country codes that are not '1' (USA)
                ////*/
                //if (!phone) { return ''; }
                //phone = String(phone);
                //// Will return formattedNumber. 
                //// If phonenumber isn't longer than an area code, just show number
                //var formattedNumber = phone;
                //// if the first character is '1', strip it out and add it back
                //var c = (phone[0] == '1') ? '1 ' : '';
                //phone = phone[0] == '1' ? phone.slice(1) : phone;
                //// # (###) ###-#### as c (area) front-end
                //var area = phone.substring(0, 3);
                //var front = phone.substring(3, 6);
                //var end = phone.substring(6, 10);
                //if (front) {
                //    formattedNumber = (c + "(" + area + ") " + front);
                //}
                //if (end) {
                //    formattedNumber += ("-" + end);
                //}
                ////console.log(formattedNumber);
                //return formattedNumber;
                if (!phone) {
                    return '';
                }
                var value = phone.toString().trim().replace(/^\+/, '');
                if (value.match(/[^0-9]/)) {
                    return phone;
                }
                var country, city, number;
                switch (value.length) {
                    case 1:
                    case 2:
                    case 3:
                        city = value;
                        break;
                    default:
                        city = value.slice(0, 3);
                        number = value.slice(3);
                }
                if (number) {
                    if (number.length > 3) {
                        number = number.slice(0, 3) + '-' + number.slice(3, 7);
                    }
                    else {
                        number = number;
                    }
                    return ("(" + city + ") " + number).trim();
                }
                else {
                    return "(" + city;
                }
            };
        }
        return forPhone;
    })();
    Filters.forPhone = forPhone;
})(Filters || (Filters = {}));
var Resource;
(function (Resource) {
    var ServerCall = (function () {
        function ServerCall($resource) {
            var updateDescriptor = { method: "PUT" };
            var sendfileDescriptor = {
                method: "POST",
                headers: { 'Content-Type': "application/x-www-form-urlencoded" },
                transformRequest: []
            };
            this.Person = $resource('/api/person/:id', { id: '@id' }, { update: updateDescriptor });
            this.Account = $resource('/api/account/:id', { id: '@id' });
            this.PersonService = $resource('/api/personservices/:id', { id: '@id' });
            this.Service = $resource('/api/services/:id', { id: '@id' });
            this.Communication = $resource('/api/comunication/:id', { id: '@id' }, { sendfile: sendfileDescriptor });
        }
        return ServerCall;
    })();
    Resource.ServerCall = ServerCall;
})(Resource || (Resource = {}));
var Resolver;
(function (Resolver) {
    "use strict";
    var CtrlResolver = (function () {
        function CtrlResolver($q, ServerCall) {
            this.mainCtrl = function () {
                var deferred = $q.defer();
                ServerCall.Person.query({ query: null, offset: 0, top: 25 }, function (persons) {
                    deferred.resolve(persons);
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            };
        }
        return CtrlResolver;
    })();
    Resolver.CtrlResolver = CtrlResolver;
})(Resolver || (Resolver = {}));
var Service;
(function (Service) {
    var Utils = (function () {
        function Utils() {
            var _sources = ['Flyer', 'Clarin', 'Facebook', 'Volantes ', 'Referido', 'American Travel', 'Otros'];
            this.Sources = _sources;
            this.virtualpath = $("#virtualpath").attr("href");
        }
        return Utils;
    })();
    Service.Utils = Utils;
})(Service || (Service = {}));
//# sourceMappingURL=mainapp.js.map