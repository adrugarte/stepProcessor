module Controller {
    export interface IcustomerScope extends ng.IScope {
        customerList: Array<Models.IPerson>;
        personQuery: any;
        getCustomerList: () => void;
    }

    export class customer {
        scope: IcustomerScope;
        constructor(scope: IcustomerScope, Callback: Service.IServerCall) {
            var self = this;
            self.scope = scope;
            self.scope.personQuery = {};

            self.scope.getCustomerList = () => {
                Callback.Person.query({ query: self.scope.personQuery, top: 50, offset: 0 }).$promise.
                    then((response) => {
                        self.scope.customerList = response;
                    },
                    (error) => {
                        alert("Error:Somenthing went wrong");
                    });
            }

            self.scope.getCustomerList();
        }
    }
}  