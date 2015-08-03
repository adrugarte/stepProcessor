module Service{

    export interface ISettingService {
        apiBaseUrl: (url: string) => string;
    }

    export class settingService implements ISettingService {
        apiBaseUrl: (url: string) => string;

        constructor() {
            var _apiBaseUrl: string = "";

            this.apiBaseUrl = function (url: string): string {
                if (url) _apiBaseUrl = url;
                return _apiBaseUrl;
            };

        }
    }

    //export interface ISettingsService {
    //    contactphone: ()=> string;
    //    setcontactphone: (phone:string) => void;
    //}
    //export class SettingsService implements ISettingsService {
    //    public contactphone: () => string;
    //    public setcontactphone: (phone: string) => void;
    //    constructor($scope: ng.IScope, $windows: any) {
    //        $windows.scopes = $windows.scopes || [];
    //        $windows.scopes.push($scope);

    //        if (!$windows.SettingsService) {
    //                $windows.SettingsService = {
    //                contactphone: "786 413 7596"
    //            }
    //        }

    //        this.contactphone = () => { return $windows.SettingsService.contactphone; }
    //        this.setcontactphone = (phone: string) => {
    //            $windows.SettingsService.contactphone = phone;
    //            angular.forEach($windows.scopes,(_scope) => {
    //                if (!_scope.$$phase) {
    //                    _scope.$apply();
    //                }
    //            })
    //        }
    //    }
    //}
} 