var Directive;
(function (Directive) {
    var message = (function () {
        function message(Callback, $compile, $http) {
            var _this = this;
            this.scope = { via: '@' };
            this.replace = true;
            this.templateUrl = "App/view/messageTemplate.html";
            this.link = function (scope, elm, attr) {
                var self = _this;
                scope.message = "";
                scope.customerList = Callback.Person.query();
                scope.selectall = function (event) {
                    for (var i = 0; i < scope.customerList.length; i++) {
                        scope.customerList[i].selected = event.target.checked;
                    }
                };
                scope.birthday = function () {
                    $http.get("api/birthdaygreeting");
                };
                scope.send = function () {
                    //if (scope.message.length > 0) {
                    //    var message: FormData = new FormData();
                    //    message.append("subject", scope.subject);
                    //    message.append("text",scope.message);
                    //    var customers = [];
                    //    for (var i = 0; i < scope.customerList.length; i++) {
                    //        if (scope.customerList[i].selected) customers.push(scope.customerList[i]);
                    //    }
                    //    //message.customers = ;
                    //    if (customers.length == 0)
                    //        alert("Customer should be selected from the list");
                    //    else {
                    //        message.append("customers", customers);
                    //        message.append("attachment", scope.attachment.files[0]);
                    //        $("#loaderDiv").show();
                    //        Callback.Communication.sendfile(message,(data) => {
                    //            $("#loaderDiv").hide();
                    //            alert("Message Sent");
                    //            CleanCustomerList();
                    //        },() => { $("#loaderDiv").hide(); });
                    //    }
                    //}
                    if (scope.message.length > 0) {
                        var message = {};
                        message.subject = scope.subject;
                        message.text = scope.message;
                        message.via = scope.via;
                        message.includeVcard = scope.includeVcard;
                        message.customers = [];
                        for (var i = 0; i < scope.customerList.length; i++) {
                            if (scope.customerList[i].selected)
                                message.customers.push(scope.customerList[i]);
                        }
                        //message.customers = ;
                        if (message.customers.length == 0)
                            alert("Customer should be selected from the list");
                        else {
                            $("#loaderDiv").show();
                            Callback.Communication.save(message, function (data) {
                                $("#loaderDiv").hide();
                                if (typeof data.errormessage != 'undefined' && data.errormessage.length > 0)
                                    alert("The message was sent. Some issues happened." + data.errormessage);
                                else
                                    alert("Message sent.");
                                //CleanCustomerList();
                            }, function () {
                                $("#loaderDiv").hide();
                                alert("Error while sent message");
                            });
                        }
                    }
                };
                //var IsInSelectedCustomers = (id) => {
                //    if (typeof scope.selectedCustomerList != 'undefined'){
                //        for (var i = 0, len = scope.selectedCustomerList.length; i < len; i++) {
                //            if (scope.selectedCustomerList[i].id == id) return i;
                //        }
                //    }
                //    return -1;
                //}
                var CleanCustomerList = function () {
                    for (var i = 0; i < scope.customerList.length; i++) {
                        scope.customerList[i].selected = false;
                    }
                };
            };
        }
        return message;
    })();
    Directive.message = message;
})(Directive || (Directive = {}));
//# sourceMappingURL=messageDirective.js.map