module Service{

    export interface ISettingsService {
        contactphone: ()=> string;
        setcontactphone: (phone:string) => void;
    }
    export class SettingsService implements ISettingsService {
        public contactphone: () => string;
        public setcontactphone: (phone: string) => void;
        constructor($scope: ng.IScope, $windows: any) {
            $windows.scopes = $windows.scopes || [];
            $windows.scopes.push($scope);

            if (!$windows.SettingsService) {
                    $windows.SettingsService = {
                    contactphone: "786 413 7596"
                }
            }

            this.contactphone = () => { return $windows.SettingsService.contactphone; }
            this.setcontactphone = (phone: string) => {
                $windows.SettingsService.contactphone = phone;
                angular.forEach($windows.scopes,(_scope) => {
                    if (!_scope.$$phase) {
                        _scope.$apply();
                    }
                })
            }
        }
    }
} 