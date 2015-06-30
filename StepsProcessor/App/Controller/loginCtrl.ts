module Controller {
    export interface ILoginCtrlScope extends ng.IScope {
        loginData: { userName: string; password: string };
        message: string;
        login: () => void;

    }

    export class loginCtrl{

        constructor($scope: ILoginCtrlScope, $location: ng.ILocationService, authService: Service.IauthService) {
            $scope.loginData = {
                userName: "",
                password: "",
            };
            $scope.message = "";

            authService.logOut();

            $scope.login = ()=> {
                authService.login($scope.loginData).then(function (response) {
                    if (authService.authentication.redirectTo.length > 0) $location.path(authService.authentication.redirectTo); else $location.path('mainmenu');
                    //console.log("Redirection from: " + authService.authentication.redirectTo);
                    authService.authentication.redirectTo = "";
                },
                    function (err) {
                        $scope.message = err.error_description;
                    });
            };
        }
    }
}


