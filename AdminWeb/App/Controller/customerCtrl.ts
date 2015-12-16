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
        constructor(scope: IcustomerScope, Callback: Resource.IServerCall, Utils:Service.Utils, $routeParams:ng.route.IRouteParamsService) {
            var self = this;
            var CustomerId = $routeParams["id"];
            self.scope = scope;
            self.scope.person = <Models.IPerson>{};
            self.scope.person.Phone = <Models.Contact>{};
            self.scope.person.Celular = <Models.Contact>{};
            self.scope.personQuery = {};
            self.scope.CustomerSources = Utils.Sources;

            self.scope.person.Phone.Type = 'phone';
            self.scope.person.Phone.Use = 1;  //private

            self.scope.person.Celular.Type = 'celular';
            self.scope.person.Celular.Use = 1;  //private


            var getCustomer = () => {
                Callback.Person.get({ id: CustomerId },(person:Models.IPerson) => {
                    self.scope.person = person;
                });
            }

            self.scope.saveCustomer = () => {
                Callback.Person.save(self.scope.person,
                    (Response) => {
                        alert('Datos guardados');
                    },
                    (Error) => {
                        alert('Han ocurrido errores al guardar los datos');
                    });
            }


            if (CustomerId > 0) getCustomer();
        }
    }
}  