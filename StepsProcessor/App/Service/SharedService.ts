module SharedService {
    "use strict";
    export class AppBuilder {
        app: ng.IModule;
        constructor(name: string) {
            var _contactphone = "777 777 7777";
            var m = {
                contactPhone: () => { return _contactphone; },
                changePhone: (phone: string) => {
                    _contactphone = phone;
                }
            }

            this.app = angular.module(name, ["ngRoute","ngResource"]);
            this.app.provider('$Settings',['$window','$rootScope', SettingsProvider]);
        }
    }

    //interface IGreetingService {
    //    getGreeting: () => string;
    //}


    export class SettingsProvider implements ng.IServiceProvider {
        public $get;

        constructor() {
            var _contactphone = "777 777 7777";

            function _setContactPhone(contactphone: string) {
                _contactphone = contactphone;
            };

            this.$get = ($window,$rootScope) => { return { getContactPhone: () => { return _contactphone; }, setContactPhone: _setContactPhone }; }
        }
    }
}
