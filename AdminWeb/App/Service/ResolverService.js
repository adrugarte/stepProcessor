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
//# sourceMappingURL=ResolverService.js.map