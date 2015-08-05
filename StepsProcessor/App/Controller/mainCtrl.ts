module Controller {
    export interface IMainCtrlScope extends ng.IScope {
        //settings: Service.ISettingsService;
        login: () => void;
        popover: {};
        authService: Service.IauthService;
        logData: Models.ILoginData;
        myFile: Models.IFileToUpload[];
        upload: () => void;
        alertSomething: () => void;
    }

    export class mainCtrl{
        scope: IMainCtrlScope;

        constructor($scope: Controller.IMainCtrlScope, $location: ng.ILocationService, authService: Service.IauthService, Uploader: Service.Uploader, Popovercontent) {
            var self = this;
            self.scope = $scope;
            self.scope.myFile = [];
            self.scope.popover = {};
            //self.scope.settings = SettingsService;
            self.scope.authService = authService;
            self.scope.logData = {password:'',userName:''};    
            self.scope.authService.authentication.userName
            self.scope.popover["OnlineServices"] = { placement: "bottom", trigger: "hover" };
            self.scope.popover["OnlineServices"]["content"] = Popovercontent['content'];

            self.scope.login = () => {
                authService.login($scope.logData).then(
                    function (response) {
                        if (authService.authentication.redirectTo.length > 0) $location.path(authService.authentication.redirectTo);
                        //console.log("Redirection from: " + authService.authentication.redirectTo);
                        authService.authentication.redirectTo = "";
                    },
                    function (err) {
                        alert("El inicio de sesion ha fallado, las credenciales no son validas");
                    }
                    );
                self.scope.logData = {password:"", userName:""};
            }


            //self.scope.upload = () => {
            //    var files = self.scope.myFile;
            //    var uploadUrl = 'http://www.example.com/images';
            //    fileUpload.uploadFileToUrl(files, uploadUrl);
            //}

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