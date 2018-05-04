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
            this.Payment = $resource('/api/payment/:id', { id: '@id' });
            this.Communication = $resource('/api/comunication/:id', { id: '@id' }, { sendfile: sendfileDescriptor });
        }
        return ServerCall;
    })();
    Resource.ServerCall = ServerCall;
})(Resource || (Resource = {}));
//# sourceMappingURL=CallbackService.js.map