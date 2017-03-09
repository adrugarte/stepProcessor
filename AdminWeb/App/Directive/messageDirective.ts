module Directive {
    export interface ImessageRecipient extends Models.IPerson {
        selected: boolean;
    }
    export interface IMessageScope extends ng.IScope {
        message: string;
        subject: string;
        customerList: Array<ImessageRecipient>;
        send: () => void;
        selectall: (event) => void;
    }

    export class message implements ng.IDirective {
        public link: ng.IDirectiveLinkFn;
        public replace = true;
        public templateUrl = "App/view/messageTemplate.html";
        constructor(Callback: Resource.IServerCall, $compile: ng.ICompileService) {
            this.link = (scope: IMessageScope , elm: ng.IAugmentedJQuery, attr: ng.IAttributes) => {
                var self = this;
                scope.message = "";
                scope.customerList = Callback.Person.query();
                //scope.move = (index, elm) => {
                //    if (elm.target.checked) {
                //        if (IsInSelectedCustomers(scope.customerList[index].id) < 0) scope.selectedCustomerList.push(scope.customerList[index]);
                //    } else {
                //        var selectedIdx = IsInSelectedCustomers(scope.customerList[index].id);
                //        scope.remove(selectedIdx);
                //    }
                //}

                //scope.remove = (index) => {
                //    scope.selectedCustomerList.splice(index, 1);
                //}

                scope.selectall = (event) => {
                    for (var i = 0; i < scope.customerList.length; i++) {
                         scope.customerList[i].selected = event.target.checked;
                    }
                }

                scope.send = () => {
                    if (scope.message.length > 0) {
                        var message: any = {};
                        message.subject = scope.subject;
                        message.text = scope.message;
                        message.customers = [];
                        for (var i = 0; i < scope.customerList.length; i++){
                            if (scope.customerList[i].selected) message.customers.push(scope.customerList[i]);
                        }
                        
                        //message.customers = ;
                        if (message.customers.length == 0)
                            alert("Customer should be selected from the list");
                        else {
                            $("#loaderDiv").show();
                            Callback.Communication.save(message,(data) => {
                                $("#loaderDiv").hide();
                                alert("Message Sent");
                                CleanCustomerList();
                            },() => {$("#loaderDiv").hide();});
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

                var CleanCustomerList = () => {
                    for (var i = 0; i < scope.customerList.length; i++) {
                        scope.customerList[i].selected = false;
                    }
                }

            }
        }
    }
} 