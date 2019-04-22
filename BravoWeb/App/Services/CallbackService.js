var Service;
(function (Service) {
    var ServerCall = (function () {
        function ServerCall($resource) {
            this.contact = $resource('/api/contact/:id', { id: '@id' });
        }
        return ServerCall;
    })();
    Service.ServerCall = ServerCall;
})(Service || (Service = {}));
//# sourceMappingURL=CallbackService.js.map