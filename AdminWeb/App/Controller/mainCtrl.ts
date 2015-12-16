module Controller {
    export interface ImainScope extends ng.IScope {
        customerList: Array<Models.IPerson>;
        personQuery: any;
        getCustomerList: () => void;
    }

    export class main{
        scope: ImainScope;
        constructor(scope: ImainScope,Callback: Resource.IServerCall, Utils: Service.Utils ) {
            var self = this;
            self.scope = scope;
            self.scope.personQuery = {};

            //self.scope.customerList = resolver['persons'];

            self.scope.getCustomerList = () => {
                Callback.Person.query({ query: self.scope.personQuery, top: 50, offset: 0 }).$promise.
                    then((response) => {
                    self.scope.customerList = response;
                },
                    (error) => {
                        alert("Error:Somenthing went wrong");
                    });
            }

            scope.getCustomerList();

        }
    }

 
} 