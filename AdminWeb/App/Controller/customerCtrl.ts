module Controller {
    export interface IcustomerScope extends ng.IScope {
        customerList: Array<Models.IPerson>;
        person: Models.IPerson;
        address: Models.Address
        phone: Models.Contact;
        celular: Models.Contact;
        email: Models.Contact;
        personQuery: any;
        customerSources: Array<string>;
        getCustomerList: () => void;
        saveCustomer: () => void;
    }

    export class customer {
        scope: IcustomerScope;
        constructor(scope: IcustomerScope, Callback: Resource.IServerCall, Utils:Service.Utils, $routeParams:ng.route.IRouteParamsService) {
            var self = this;
            var CustomerId = parseInt($routeParams["id"]);
            self.scope = scope;
            self.scope.person = <Models.IPerson>{};
            self.scope.person.addresses = [];
            self.scope.person.contacts = [];

            self.scope.address = <Models.Address>{};
            self.scope.phone = <Models.Contact>{};
            self.scope.celular = <Models.Contact>{};
            self.scope.email = <Models.Contact>{};
            self.scope.personQuery = {};
            self.scope.customerSources = Utils.Sources;


            var getCustomer = () => {
                Callback.Person.get({ id: CustomerId },(response) => {
                    self.scope.person = response.person;
                    if (self.scope.person.addresses) self.scope.address = self.scope.person.addresses[0];
                    if (self.scope.person.contacts) {
                        self.scope.phone = getContact("phone");
                        self.scope.celular = getContact("cellular");
                        self.scope.email = getContact("email");
                    }
                });
            }

            var setContacts = () => {
                if (self.scope.address.address1 || self.scope.address.address2 || self.scope.address.city || self.scope.address.zipCode) {
                    self.scope.address.type = "Home";
                    if (!self.scope.person.addresses) self.scope.person.addresses = [];
                    self.scope.person.addresses.push(self.scope.address);
                }


                if (self.scope.phone.value) {
                    self.scope.phone.type = 'Phone';
                    self.scope.phone.use = 'Private';  //private
                    if (!self.scope.person.contacts) self.scope.person.contacts = [];
                    self.scope.person.contacts.push(self.scope.phone);
                }
                if (self.scope.celular.value) {
                    self.scope.celular.type = 'Cellular';
                    self.scope.celular.use = 'Private';  //private
                    if (!self.scope.person.contacts) self.scope.person.contacts = [];
                    self.scope.person.contacts.push(self.scope.celular);
                }
                if (self.scope.email.value) {
                    self.scope.email.type = 'Email';
                    self.scope.email.use = 'Private';  //private
                    if (!self.scope.person.contacts) self.scope.person.contacts = [];
                    self.scope.person.contacts.push(self.scope.email);
                }
            }

            var getContact = (contacttype: string): Models.Contact => {
                var i;
                for (i = 0; i < self.scope.person.contacts.length; i++) {
                    if (self.scope.person.contacts[i].type == contacttype) return self.scope.person.contacts[i];
                }
            }

            self.scope.saveCustomer = () => {
                setContacts();
                if (self.scope.person.id) {
                    Callback.Person.update(self.scope.person,
                        (Response) => {
                            alert('Datos guardados');
                        },
                        (Error) => {
                            alert('Han ocurrido errores al guardar los datos');
                        });
                } else {
                    Callback.Person.save(self.scope.person,
                        (Response) => {
                            alert('Datos guardados');
                        },
                        (Error) => {
                            alert('Han ocurrido errores al guardar los datos');
                        });
                }
            }

            if (CustomerId != 0) getCustomer();
        }
    }
}  