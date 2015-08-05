module Service {
    "use strict";
    export class Resolver {
        mainCtrl:()=> any;
        constructor($q:ng.IQService) {
            this.mainCtrl = () => {
                    var deferred = $q.defer<any>();
                    $.getJSON("App/Texts/OnlineServices.json", function (jsondata) {
                        deferred.resolve(jsondata);
                    });
                    return deferred.promise;
            }
        }
    }

 

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
