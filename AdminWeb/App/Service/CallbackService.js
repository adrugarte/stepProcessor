var Resource;
(function (Resource) {
    var ServerCall = (function () {
        function ServerCall($resource) {
            var updateDescriptor = { method: "PUT" };
            this.Person = $resource('/api/person/:id', { id: '@id' }, { update: updateDescriptor });
            this.Account = $resource('/api/account/:id', { id: '@id' });
        }
        return ServerCall;
    })();
    Resource.ServerCall = ServerCall;
})(Resource || (Resource = {}));
//# sourceMappingURL=CallbackService.js.map