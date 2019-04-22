module Controller {
    export interface IcustomerScope extends ng.IScope {
        customerId: number;
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
        printCustomer: () => void;
    }

    export class customer {
        scope: IcustomerScope;
        constructor(scope: IcustomerScope, Callback: Resource.IServerCall, Utils:Service.Utils, $routeParams:ng.route.IRouteParamsService, $location:ng.ILocationService) {
            var self = this;
            self.scope = scope;
            self.scope.customerId = parseInt($routeParams["id"]);
            self.scope.person = <Models.IPerson>{};
            self.scope.person.addresses = [];
            self.scope.person.contacts = [];

            self.scope.address = <Models.Address>{};
            self.scope.phone = <Models.Contact>{};
            self.scope.celular = <Models.Contact>{};
            self.scope.email = <Models.Contact>{};
            self.scope.personQuery = {};
            self.scope.customerSources = Utils.Sources;

            self.scope.printCustomer = () => {
                window.print();
            }


            var getCustomer = () => {
                Callback.Person.get({ id: self.scope.customerId },(response) => {
                    self.scope.person = response.person;
                    if (self.scope.person.addresses) self.scope.address = self.scope.person.addresses[0];
                    if (self.scope.person.contacts) {
                        self.scope.phone = getContact("1");
                        self.scope.celular = getContact("2");
                        self.scope.email = getContact("3");
                    }
                });
            }

            var setContacts = () => {
                self.scope.person.addresses = []; 
                self.scope.person.contacts = []; 

                if (self.scope.address && (self.scope.address.address1 || self.scope.address.address2 || self.scope.address.city || self.scope.address.zipCode)) {
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

                return <Models.Contact>{};
            }

 


            self.scope.saveCustomer = () => {
                setContacts();
                if (self.scope.person.id) {
                    Callback.Person.update(self.scope.person,
                        (person) => {
                            alert("Datos Guardados ");
                        },
                        (Error) => {
                            alert('Han ocurrido errores al guardar los datos');
                        });
                } else {
                    Callback.Person.save(self.scope.person,
                        (result:any) => {
                            self.scope.person = result;
                            self.scope.customerId = result.id;
                            $location.path("/customer/" + self.scope.customerId);
                            alert("Datos Guardados ");
                        },
                        (Error) => {
                            alert('Han ocurrido errores al guardar los datos');
                        });
                }
            }

            if (self.scope.customerId != 0) getCustomer();
        }
    }
}  