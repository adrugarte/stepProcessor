var Controller;
(function (Controller) {
    var formCtrl = (function () {
        function formCtrl($scope) {
            var self = this;
            self.scope = $scope;
            self.scope.SubmitQuote = function () {
            };
        }
        return formCtrl;
    })();
    Controller.formCtrl = formCtrl;
})(Controller || (Controller = {}));
//# sourceMappingURL=contactController.js.map