


module head{
    export interface IheadCtrlScope extends ng.IScope {
        template: string;
        settings: Models.ISettingsService;
        change: () => void;
        refresh: () => void;
    }

    export class headCtrl{
        scope: IheadCtrlScope;
        constructor($scope: IheadCtrlScope, SettingsService: Models.ISettingsService, $rootScope: ng.IScope) {
            var self = this;
            self.scope = $scope;
            self.scope.template = "App/View/head.html";

            self.scope.settings = SettingsService;

            self.scope.change = () => {
                self.scope.settings.setcontactphone("999 999 9999");
            }
            self.scope.refresh = () => {
                $scope.$apply();
            }
        }
    }
} 