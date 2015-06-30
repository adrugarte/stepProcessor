module Controller {
    export interface IMainCtrlScope extends ng.IScope {
        //settings: Service.ISettingsService;
        login: () => void;
        authService: Service.IauthService;
        logData: Models.ILoginData;
    }

    export class mainCtrl{
        scope: IMainCtrlScope;

        constructor($scope: IMainCtrlScope, $location:ng.ILocationService, AuthService:Service.IauthService) {
            var self = this;
            self.scope = $scope;
            //self.scope.settings = SettingsService;
            self.scope.authService = AuthService;
            self.scope.logData = {password:'',userName:''};    
            self.scope.authService.authentication.userName

            self.scope.login = () => {
                AuthService.login($scope.logData).then(
                    function (response) {
                        if (AuthService.authentication.redirectTo.length > 0) $location.path(AuthService.authentication.redirectTo);
                        //console.log("Redirection from: " + authService.authentication.redirectTo);
                        AuthService.authentication.redirectTo = "";
                    },
                    function (err) {
                        alert("El inicio de sesion ha fallado, las credenciales no son validas");
                    }
                    );
                self.scope.logData = {password:"", userName:""};
            }


        }

    }




} 