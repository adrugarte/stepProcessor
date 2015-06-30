/// <reference path="../models/models.ts" />

module Directive {
    'use strict';
    export interface IStepFiedlGeneratorparentScope extends ng.IScope {
        stepForm: ng.IFormController;
    }
    export interface IStepFiedlGeneratorScope extends ng.IScope {
        item: Models.IFieldlayout;
        parent: any;
    }
    export interface IStepFiedlGeneratorAttrs extends ng.IAttributes {
        item: string;
    }

    export class StepFieldGenerator implements ng.IDirective {
        public restrict = 'AE';
        public require = '^form';
        public link: (scope: IStepFiedlGeneratorScope, el: JQuery, attrs: ng.IAttributes, formCtrl: ng.IFormController) => void;
        public replace = true;
        constructor($compile: ng.ICompileService, $templateCache: ng.ITemplateCacheService, $parse:ng.IParseService) {
            var template = {
                input: '<label class="[labelclass]" [labelstyle] for="[for]">{{item.field}}:</label><div class="[fieldclass]"><input id="[id]" class="form-control" ng-class="{\'fielderror\': stepform.[field].$error.required && !stepform.[field].$pristine}" type="text" name="{{item.field}}" ng-model="[fieldngmodel]" [required]/>[error]</div>',
                email: '<label class="[labelclass]" [labelstyle] for="[for]">{{item.field}}:</label><div class="[fieldclass]"><input class="form-control" type="email" name="{{item.field}}" ng-class="{\'fielderror\': stepform.[field].$error.email && !stepform.[field].$pristine}" ng-model="[fieldngmodel]" [required]/>[error]</div>',
                dropdownlist: '<label class="[labelclass]" [labelstyle] for="[for]">{{item.field}}:</label><ag-input-select class="[fieldclass]" ng-model="[ngmodel]" dropdown-id="[field]" [inputname] start-dropindex="[dropindex]" is-options="[optionlist]" />',
                datetimepicker: { template: 'datetimepicker.html' },
                radio: { template: 'radio.html' }
            };

            this.link = (scope: IStepFiedlGeneratorScope, el: ng.IAugmentedJQuery, attrs: IStepFiedlGeneratorAttrs, formCtrl: ng.IFormController) => {
                var validemail = '<span class="error" ng-show="stepform[\'[field]\'].$error.email">Not valid email!</span>';
                var requiredfield = '<span class="error" ng-show="stepform[\'[field]\'].$error.required && !stepform[\'[field]\'].$pristine">[field] can\'t be empty!</span>';
                var errors = "";
                var linktemplate;
                scope.item = $parse(attrs.item)(scope)
                switch (scope.item.fieldtype) {
                    case "string":
                        linktemplate = template.input;
                        linktemplate = linktemplate.replace("[fieldngmodel]", scope.item.ngmodel)
                            .replace("[divclass]", scope.item.divclass)
                            .replace("[for]", scope.item.field).replace("[id]", scope.item.field)
                            .replace("[labelclass]", scope.item.labelclass ? scope.item.labelclass : "")
                            .replace("[labelstyle]", scope.item.labelstyle ? scope.item.labelstyle : "")
                            .replace("[fieldclass]", scope.item.fieldclass ? scope.item.fieldclass : "")
                            .replace("[required]", scope.item.required ? scope.item.required:"")
                        break;
                    case "email":
                        linktemplate = template.email;
                        linktemplate = linktemplate.replace("[fieldngmodel]", scope.item.ngmodel)
                            .replace("[divclass]", scope.item.divclass)
                            .replace("[for]", scope.item.field).replace("[id]", scope.item.field)
                            .replace("[labelclass]", scope.item.labelclass ? scope.item.labelclass : "")
                            .replace("[labelstyle]", scope.item.labelstyle ? scope.item.labelstyle : "")
                            .replace("[fieldclass]", scope.item.fieldclass ? scope.item.fieldclass : "")
                        break;
                    case "datetime":
                        linktemplate = $templateCache.get(template.datetimepicker.template);
                        linktemplate = replaceAll(replaceAll(linktemplate, "[fieldngmodel]", scope.item.ngmodel), "[divclass]", scope.item.divclass);
                        linktemplate = linktemplate.replace("[fieldngmodel]", scope.item.ngmodel)
                            .replace("[divclass]", scope.item.divclass).replace("[for]", scope.item.field).replace("[id]", scope.item.field)
                            .replace("[labelclass]", scope.item.labelclass ? scope.item.labelclass : "")
                            .replace("[labelstyle]", scope.item.labelstyle ? scope.item.labelstyle : "")
                            .replace("[fieldclass]", scope.item.fieldclass ? scope.item.fieldclass : "")
                            .replace("[formatter]", scope.item.dataformater ? scope.item.dataformater : "")
                            .replace("[inputstyle]", scope.item.dpstyle ? scope.item.dpstyle : "")
                        break;
                    case "radio":
                        linktemplate = $templateCache.get(template.radio.template);
                        linktemplate = linktemplate.replace("[fieldngmodel]", scope.item.ngmodel)
                            .replace("[divclass]", scope.item.divclass)
                            .replace("[id]", scope.item.field)
                            .replace("[labelclass]", scope.item.labelclass ? scope.item.labelclass : "")
                            .replace("[radioclass]", scope.item.radioclass ? scope.item.radioclass : "")
                            .replace("[labelstyle]", scope.item.labelstyle ? scope.item.labelstyle : "")
                            .replace("[fieldclass]", scope.item.fieldclass ? scope.item.fieldclass : "")
                            .replace("[radioList]", scope.item.radiolist ? scope.item.radiolist : "")
                            .replace("[showfield]", scope.item.showfield ? scope.item.showfield : "")
                        linktemplate = replaceAll(linktemplate, "[valuefield]", scope.item.valuefield);
                        break;
                    case "dropdownlist":
                        linktemplate = template.dropdownlist;
                        for (var key in scope.item) {
                            linktemplate = replaceAll(linktemplate, "[" + key + "]", scope.item[key] ? scope.item[key] : "");
                        }
                        break;
                    default:
                        break;
                }
                linktemplate = replaceAll(linktemplate, "[field]", scope.item.field);


                if (scope.item.required == "required") {
                    errors = errors + replaceAll(requiredfield, "[field]", scope.item.field);
                }

                if (scope.item.fieldtype  == "email") {
                    errors = errors + replaceAll(validemail, "[field]", scope.item.field);
                }

                if (scope.item.fieldtype == "email" || scope.item.fieldtype == "string") {
                    linktemplate = replaceAll('<div class= "[divclass]" >', "[divclass]", scope.item.divclass)
                    + '<ng-form name="stepform">'
                    + replaceAll(linktemplate, "[error]", errors)
                    + '</ng-form>{{stepform}}</div>';
                }


                el.replaceWith($compile(angular.element(linktemplate))(scope));
                //formCtrl.$addControl();

                function escapeRegExp(str) {
                    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
                }

                function replaceAll(str, find, replace) {
                    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
                }

            }
        }

        
    }
}