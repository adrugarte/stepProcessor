var Controller;
(function (Controller) {
    var formCtrl = (function () {
        function formCtrl($scope, CallbackSrv) {
            var self = this;
            self.scope = $scope;
            self.scope.contact = {};
            self.scope.SubmitQuote = function () {
                CallbackSrv.contact.save(self.scope.contact, function () {
                    self.scope.contact.successmsg = "Your message has been submited";
                });
            };
        }
        return formCtrl;
    })();
    Controller.formCtrl = formCtrl;
})(Controller || (Controller = {}));
//# sourceMappingURL=contactController.js.map