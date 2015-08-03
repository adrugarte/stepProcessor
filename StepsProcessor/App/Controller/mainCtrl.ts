module Controller {
    export interface IMainCtrlScope extends ng.IScope {
        //settings: Service.ISettingsService;
        login: () => void;
        authService: Service.IauthService;
        logData: Models.ILoginData;
        myFile: Models.IFileToUpload[];
        upload: () => void;
        alertSomething: () => void;
    }

    export class mainCtrl{
        scope: IMainCtrlScope;

        constructor($scope: IMainCtrlScope, $location: ng.ILocationService, AuthService: Service.IauthService, fileUpload: Service.Uploader) {
            var self = this;
            self.scope = $scope;
            self.scope.myFile = [];
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


            self.scope.upload = () => {
                var files = self.scope.myFile;
                var uploadUrl = 'http://www.example.com/images';
                fileUpload.uploadFileToUrl(files, uploadUrl);
            }

            //self.scope.alertSomething = function () {
            //    // The .open() method returns a promise that will be either
            //    // resolved or rejected when the modal window is closed.
            //    var promise = modals.open("alert",
            //        {
            //            message: "I think you are kind of beautiful!"
            //        },false);

            //    promise.then(
            //        function handleResolve(response) {
            //            console.log("Alert resolved.");
            //        },
            //        function handleReject(error) {
            //            console.warn("Alert rejected!");
            //        }
            //        );
            //};



        }

    }




} 