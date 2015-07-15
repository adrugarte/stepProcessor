module Directive {
    export interface IngNameDirective extends ng.IDirective {
        priority: any
    } 


    export class DateFormatter implements ng.IDirective {
        public require = 'ngModel';
        public link :(scope:ng.IScope,elm:JQuery,attrs:ng.IAttributes,ngModelCtrl:ng.INgModelController) => void;
        constructor($filter:ng.IFilterService) {

            this.link = (scope: ng.IScope, elm: JQuery, attrs: ng.IAttributes, ngModelCtrl: ng.INgModelController) => {
                ngModelCtrl.$parsers.push(function (data) {
                    if (angular.isDate(data))
                        return new Date(data).toUTCString(); //converted
                    else return data;
                });

                ngModelCtrl.$formatters.push(function (data) {
                    //convert data from model format to view format
                    if (angular.isDate(data))
                        return $filter('date')(data, 'MM/dd/yyyy'); //converted
                    else
                        return data;
                });
            }
        }
    }

    export class ngName implements ng.IDirective {
        public priority = 9999;
        public controller: ($scope: ng.IScope, $attrs: ng.IAttributes) => void;
        constructor($interpolate:ng.IInterpolateService) {
            this.controller = ($scope:ng.IScope, $attrs:ng.IAttributes) => {
                var interpolatedName = $interpolate($attrs['ngName'])($scope);
                if (interpolatedName) $attrs.$set('name', interpolatedName);
            }
        }
    }


    export class fileModel implements ng.IDirective{
        public restrict = 'A';
        public link: (scope: ng.IScope, element, attrs: ng.IAttributes) => void;
        constructor($parse: ng.IParseService) {
            this.link = function (scope, element, attrs) {
                var fileArray = $parse(attrs['fileModel']);
                var modelSetter = fileArray.assign;
                element.bind('change', function () {
                    var files = fileArray(scope);
                    angular.forEach(element[0].files, function (file) {
                        var fileObj: Models.IFileToUpload = { Id: element[0].id, File: { id: element[0].id, name:"" , file: file }, Decription:"", Type:"" };
                        files.push(fileObj);
                    })
                    scope.$apply(function () {
                        modelSetter(scope, files);
                    });
                });
            }
        }
    }
} 