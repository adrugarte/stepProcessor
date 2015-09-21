module Controller {
    export interface IcustomerScope extends ng.IScope {
        customerList: Array<Models.IPerson>;
        person: Models.IPerson;
        personQuery: any;
        CustomerSources: Array<string>;
        getCustomerList: () => void;
        saveCustomer: () => void;
    }

    export class customer {
        scope: IcustomerScope;
        constructor(scope: IcustomerScope, Callback: Service.IServerCall, Utils:Service.Utils, $routeParams:ng.route.IRouteParamsService) {
            var self = this;
            var action = $routeParams["action"];
            self.scope = scope;
            self.scope.person = <Models.IPerson>{};
            self.scope.personQuery = {};
            self.scope.CustomerSources = Utils.Sources;
            self.scope.saveCustomer = () => {
                Callback.Person.save(self.scope.person,
                    (Response) => {
                        alert('Datos guardados');
                    },
                    (Error) => {
                        alert('Han ocurrido errores al guardar los datos');
                    });
            }

            self.scope.getCustomerList = () => {
                Callback.Person.query({ query: self.scope.personQuery, top: 50, offset: 0 }).$promise.
                    then((response) => {
                        self.scope.customerList = response;
                    },
                    (error) => {
                        alert("Error:Somenthing went wrong");
                    });
            }

            if (action == "Lista") self.scope.getCustomerList();
        }
    }
}  