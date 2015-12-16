module Resolver {
    "use strict";
    export class CtrlResolver{
        mainCtrl: () => any;
        constructor($q: ng.IQService, ServerCall: Resource.IServerCall) {
            this.mainCtrl = () => {
                var deferred = $q.defer<any>();
                ServerCall.Person.query({ query: null, offset: 0, top: 25 },
                    (persons: any) => {
                        deferred.resolve(persons);
                    },() => {
                        deferred.reject();
                    })
                return deferred.promise;
            }
        }
    }
}