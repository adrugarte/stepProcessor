module Directive {
    export interface ImessageRecipient extends Models.IPerson {
        selected: boolean;
    }
    export interface IMessageScope extends ng.IScope {
        message: string;
        subject: string;
        via: string;
        includeVcard: boolean;
        customerList: Array<ImessageRecipient>;
        attachment: any;
        send: () => void;
        birthday: () => void;
        selectall: (event) => void;
    }

    export class message implements ng.IDirective {
        public link: ng.IDirectiveLinkFn;
        public scope: { [key: string]: string } = {via:'@'};
        public replace = true;
        public templateUrl = "App/view/messageTemplate.html";
        constructor(Callback: Resource.IServerCall, $compile: ng.ICompileService,$http:ng.IHttpService ) {
            this.link = (scope: IMessageScope , elm: ng.IAugmentedJQuery, attr: ng.IAttributes) => {
                var self = this;
                scope.message = "";
                scope.customerList = Callback.Person.query();


                scope.selectall = (event) => {
                    for (var i = 0; i < scope.customerList.length; i++) {
                         scope.customerList[i].selected = event.target.checked;
                    }
                }

                scope.birthday = () => {
                    $http.get("api/birthdaygreeting");
                }

                scope.send = () => {
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
                        var message: any = {};
                        message.subject = scope.subject;
                        message.text = scope.message;
                        message.via = scope.via;
                        message.includeVcard = scope.includeVcard;
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
                                if (typeof data.errormessage != 'undefined' && data.errormessage.length > 0)
                                    alert("The message was sent. Some issues happened." + data.errormessage);
                                else
                                    alert("Message sent.");
                                //CleanCustomerList();
                            },() => {
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

                var CleanCustomerList = () => {
                    for (var i = 0; i < scope.customerList.length; i++) {
                        scope.customerList[i].selected = false;
                    }
                }

            }
        }
    }
} 