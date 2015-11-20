module Controller {
    export interface IContactCtrlScope extends ng.IScope {
        contact: any;
        SubmitQuote: () => void;
    }

    export class formCtrl {
        scope: IContactCtrlScope;
        constructor($scope: IContactCtrlScope, CallbackSrv:Service.IServerCall) {
            var self = this;
            self.scope = $scope;
            self.scope.contact = {};

            self.scope.SubmitQuote = () => {
                CallbackSrv.contact.save(self.scope.contact,() => {
                    self.scope.contact.successmsg = "Your message has been submited";
                })
            }
        }
    }

} 