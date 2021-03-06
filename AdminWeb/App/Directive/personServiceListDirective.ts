﻿module Directive {
    export interface IpersonServiceListScope extends ng.IScope {
        personId: number; 
        editing: boolean;
        services: Array<any>;
        personServiceList: Array<Models.PersonService>;
        newservice: {};
        Delete: (idx: number) => void;
        Save: (idx: number) => void;
        search: () => void;
        Add: () => void;
        Close: (idx: number) => void;
        Cancel: (idx: number) => void;
        setPrice: () => void;
    }

    export class personServiceList implements ng.IDirective {
        public link: ng.IDirectiveLinkFn;
        public replace = true;
        public scope = { personId: '=' };
        public templateUrl = "App/view/personServiceList.html";
        constructor(Callback: Resource.IServerCall, window:ng.IWindowService) {

            this.link = (scope: IpersonServiceListScope, elm: ng.IAugmentedJQuery) => {
                var self = this;
                scope.personServiceList = [];
                //self.scope = scope;
                scope.services =  Callback.Service.query();

                var getServicePrice = (id: number): number => {
                    var price: number = 0;
                    for (var i = 0; i < scope.services.length; ++i) {
                        if (scope.services[i]['id'] == id) price = scope.services[i]['price'];
                    }
                    return price;
                }

                var getService = (id: number): any => {
                    for (var i = 0; i < scope.services.length; ++i) {
                        if (scope.services[i]['id'] == id) return scope.services[i];
                    }
                    return null;
                }

                scope.Delete = (idx: number) => {
                    if (window.confirm("Are you sure to delete this service?")) {
                        Callback.PersonService.delete({ id: scope.personServiceList[idx]['id'] }).$promise.then(function (response) {
                            scope.personServiceList.splice(idx, 1);
                        })
                    }
                };

                //scope.Cancel = (idx) => {
                //    scope.personServiceList[idx].$rollbackViewValue();

                //}

                scope.Close = (idx: number) => {
                    if (window.confirm("Are you sure to close the service " + scope.personServiceList[idx].serviceDesc + "?")) {
                        scope.personServiceList[idx].finished = new Date().toLocaleString();
                        Callback.PersonService.save(scope.personServiceList[idx]);
                    }
                }

                scope.Add = () => {
                    if (!scope.newservice || !scope.newservice['Id']) return;
                    var pservice: Models.PersonService = <Models.PersonService>{};
                    var service = getService(scope.newservice['Id']);
                    pservice.serviceDesc = service.serviceDesc;
                    pservice.price = scope.newservice['Price'] != null ? scope.newservice['Price']:service.price;
                    pservice.form = service.form;
                    pservice.personId = scope.personId;
                    pservice.PaidAmount = scope.newservice['Paid'];
                    pservice.serviceId = service.id;
                    Callback.PersonService.save(pservice).$promise.then(function (response) {
                        scope.personServiceList.push(response);
                        scope.newservice = {};
                    })
                };
                scope.setPrice = () => {
                    scope.newservice['Price'] = getService(scope.newservice['Id']).price; 
                };


                scope.Save = (idx:number) => {
                    scope.personServiceList[idx]
                    Callback.PersonService.save(scope.personServiceList[idx]).$promise
                        .then(() => {
                        scope.editing = false;
                    }) 

                }

                var getPersonServiceList = () => {
                    if (!scope.personId) scope.personId = -1;
                    Callback.PersonService.query({PersonId: scope.personId}).$promise.
                        then((response) => {
                        scope.personServiceList = response;
                    });
                }
                scope.search = () => {
                    getPersonServiceList();
                }



                scope.search();
            }

        }
    }

}
  