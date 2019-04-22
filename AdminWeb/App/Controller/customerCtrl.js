var Controller;
(function (Controller) {
    var customer = (function () {
        function customer(scope, Callback, Utils, $routeParams, $location) {
            var self = this;
            self.scope = scope;
            self.scope.customerId = parseInt($routeParams["id"]);
            self.scope.person = {};
            self.scope.person.addresses = [];
            self.scope.person.contacts = [];
            self.scope.address = {};
            self.scope.phone = {};
            self.scope.celular = {};
            self.scope.email = {};
            self.scope.personQuery = {};
            self.scope.customerSources = Utils.Sources;
            self.scope.printCustomer = function () {
                alert("Hello there");
            };
            var getCustomer = function () {
                Callback.Person.get({ id: self.scope.customerId }, function (response) {
                    self.scope.person = response.person;
                    if (self.scope.person.addresses)
                        self.scope.address = self.scope.person.addresses[0];
                    if (self.scope.person.contacts) {
                        self.scope.phone = getContact("1");
                        self.scope.celular = getContact("2");
                        self.scope.email = getContact("3");
                    }
                });
            };
            var setContacts = function () {
                self.scope.person.addresses = [];
                self.scope.person.contacts = [];
                if (self.scope.address && (self.scope.address.address1 || self.scope.address.address2 || self.scope.address.city || self.scope.address.zipCode)) {
                    self.scope.address.type = "Home";
                    if (!self.scope.person.addresses)
                        self.scope.person.addresses = [];
                    self.scope.person.addresses.push(self.scope.address);
                }
                if (self.scope.phone.value) {
                    self.scope.phone.type = 'Phone';
                    self.scope.phone.use = 'Private'; //private
                    if (!self.scope.person.contacts)
                        self.scope.person.contacts = [];
                    self.scope.person.contacts.push(self.scope.phone);
                }
                if (self.scope.celular.value) {
                    self.scope.celular.type = 'Cellular';
                    self.scope.celular.use = 'Private'; //private
                    if (!self.scope.person.contacts)
                        self.scope.person.contacts = [];
                    self.scope.person.contacts.push(self.scope.celular);
                }
                if (self.scope.email.value) {
                    self.scope.email.type = 'Email';
                    self.scope.email.use = 'Private'; //private
                    if (!self.scope.person.contacts)
                        self.scope.person.contacts = [];
                    self.scope.person.contacts.push(self.scope.email);
                }
            };
            var getContact = function (contacttype) {
                var i;
                for (i = 0; i < self.scope.person.contacts.length; i++) {
                    if (self.scope.person.contacts[i].type == contacttype)
                        return self.scope.person.contacts[i];
                }
                return {};
            };
            self.scope.saveCustomer = function () {
                setContacts();
                if (self.scope.person.id) {
                    Callback.Person.update(self.scope.person, function (person) {
                        alert("Datos Guardados ");
                    }, function (Error) {
                        alert('Han ocurrido errores al guardar los datos');
                    });
                }
                else {
                    Callback.Person.save(self.scope.person, function (result) {
                        self.scope.person = result;
                        self.scope.customerId = result.id;
                        $location.path("/customer/" + self.scope.customerId);
                        alert("Datos Guardados ");
                    }, function (Error) {
                        alert('Han ocurrido errores al guardar los datos');
                    });
                }
            };
            if (self.scope.customerId != 0)
                getCustomer();
        }
        return customer;
    })();
    Controller.customer = customer;
})(Controller || (Controller = {}));
//# sourceMappingURL=customerCtrl.js.map