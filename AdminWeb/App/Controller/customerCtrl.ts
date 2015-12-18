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
            self.scope.person.Address = <Models.Address>{};
            self.scope.person.Phone = <Models.Contact>{};
            self.scope.person.Celular = <Models.Contact>{};
            self.scope.person.Email = <Models.Contact>{};
            self.scope.personQuery = {};
            self.scope.CustomerSources = Utils.Sources;

            self.scope.person.Address.Type = "Home";

            self.scope.person.Phone.Type = 'Phone';
            self.scope.person.Phone.Use = 'Private';  //private

            self.scope.person.Celular.Type = 'Cellular';
            self.scope.person.Celular.Use = 'Private';  //private

            self.scope.person.Email.Type = 'email';
            self.scope.person.Email.Use = 'Private';  //private

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