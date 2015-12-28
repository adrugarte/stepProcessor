module Controller {
    export interface ImainScope extends ng.IScope {
        currentListPage: number;
        query: string;
        //customerList: Array<Models.IPerson>;
        //personQuery: any;
        //getCustomerList: () => void;
    }

    export class main{
        scope: ImainScope;
        constructor(scope: ImainScope, Callback: Resource.IServerCall, Utils: Service.Utils, $routeParams:ng.route.IRouteParamsService) {

            scope.currentListPage = $routeParams["page"] ? $routeParams["page"] : 0;
            scope.query = $routeParams["query"] ? $routeParams["query"] : "";
            //self.scope.personQuery = {};

            ////self.scope.customerList = resolver['persons'];

            //self.scope.getCustomerList = () => {
            //    Callback.Person.query({ query: self.scope.personQuery, top: 50, offset: 0 }).$promise.
            //        then((response) => {
            //        self.scope.customerList = response;
            //    },
            //        (error) => {
            //            alert("Error:Somenthing went wrong");
            //        });
            //}

            //scope.getCustomerList();

        }
    }

 
} 