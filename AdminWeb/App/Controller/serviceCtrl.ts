module Controller {
    export interface IServiceScope extends ng.IScope {
        service: Models.PersonService;
        services: Array<any>;
        routeParam: any;
        save: () => void;
        setPrice: () => void;
        //customerList: Array<Models.IPerson>;
        //personQuery: any;
        //getCustomerList: () => void;
    }

    export class service {
        scope: IServiceScope;
        constructor(scope: IServiceScope, Callback: Resource.IServerCall, Utils: Service.Utils, $routeParams: ng.route.IRouteParamsService) {
            var self = this;
            self.scope = scope;
            self.scope.service = <Models.PersonService>{};

            self.scope.routeParam = $routeParams;

            if (self.scope.routeParam.id && self.scope.routeParam.id>0) {
                Callback.PersonService.get({ id: self.scope.routeParam.id }).$promise
                    .then((service:Models.PersonService) => {
                        self.scope.service = service;
                    })
            }else if (self.scope.routeParam.customer) {
                Callback.Person.get({ id: self.scope.routeParam.customer }).$promise
                    .then((customer) => {
                    self.scope.service.personId = parseInt(customer.person.id);
                    self.scope.service.personName = customer.person.lastName + ", " + customer.person.firstName;
                },
                    (error) => {

                    })
            }

           

            self.scope.services = Callback.Service.query();

            self.scope.save = () => {
                Callback.PersonService.save(self.scope.service).$promise
                    .then((response) => {
                    alert("Data Saved");
                    },(error)=> {
                        alert("Data Error");
                    });
            }
            self.scope.setPrice = () => {
                    scope.service['Price'] = getService(self.scope.service['Id']).price;
            };

            var getService = (id: number): any => {
                for (var i = 0; i < scope.services.length; ++i) {
                    if (scope.services[i]['id'] == id) return scope.services[i];
                }
                return null;
            }



        }
    }


} 