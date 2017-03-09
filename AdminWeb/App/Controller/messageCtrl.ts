module Controller {
    export interface IMessageCtrlScope extends ng.IScope {
    }

    export class messageCtrl {
        scope: IMessageCtrlScope;
        constructor(scope: IMessageCtrlScope, Callback: Resource.IServerCall, Utils: Service.Utils) {

        }
    }


} 