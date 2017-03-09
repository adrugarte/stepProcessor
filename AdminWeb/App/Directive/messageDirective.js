var Directive;
(function (Directive) {
    var message = (function () {
        function message(Callback, $compile) {
            var _this = this;
            this.replace = true;
            this.templateUrl = "App/view/messageTemplate.html";
            this.link = function (scope, elm, attr) {
                var self = _this;
                scope.message = "";
                scope.customerList = Callback.Person.query();
                scope.move = function (index) {
                    if (!IsInSelectedCustomers(scope.customerList[index].id))
                        scope.selectedCustomerList.push(scope.customerList[index]);
                };
                scope.remove = function (index) {
                    scope.selectedCustomerList.splice(index, 1);
                };
                scope.send = function () {
                    if (scope.message.length > 0) {
                        var message;
                        message.subject = scope.subject;
                        message.text = scope.message;
                        message.customers = scope.selectedCustomerList;
                        Callback.Communication.save({});
                    }
                };
                var IsInSelectedCustomers = function (id) {
                    for (var i = 0, len = scope.selectedCustomerList.length; i < len; i++) {
                        if (scope.selectedCustomerList[i].id == id)
                            return true;
                    }
                    return false;
                };
            };
        }
        return message;
    })();
    Directive.message = message;
})(Directive || (Directive = {}));
//# sourceMappingURL=messageDirective.js.map