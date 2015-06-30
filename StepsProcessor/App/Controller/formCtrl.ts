module StepProcessor {
    export interface IformCtrlScope extends ng.IScope {
        FormFields: Array<any>;
        Genres: Array<any>;
        person: any;
        education: {}[];
    }

    export class formCtrl {
        scope: IformCtrlScope;
        constructor($scope: IformCtrlScope, moment: any, template) {

            moment.locale('en');
            var self = this;
            self.scope = $scope;
            self.scope.person = {};


            self.scope.FormFields = [];
            self.scope.FormFields.push({ field: "Name", fieldtype: "string", maxlenght: 50, ngmodel: "person.firstname", divclass: "col-md-12 form-group", labelclass: "textlabelclass", fieldclass: "textfieldclass",required:"required" });
            self.scope.FormFields.push({ field: "LastName", fieldtype: "string", maxlenght: 50, ngmodel: "person.lastname", divclass: "col-md-12 form-group", labelclass: "textlabelclass", fieldclass: "textfieldclass", required: "required"  });
            self.scope.FormFields.push({ field: "Middle", fieldtype: "string", maxlenght: 50, ngmodel: "person.middlename", divclass: "col-md-12 form-group", labelclass: "textlabelclass", fieldclass: "textfieldclass" });
            self.scope.FormFields.push({ field: "BirthDate", fieldtype: "datetime", maxlenght: 160, ngmodel: "person.bithdate", divclass: "col-md-12 form-group", labelclass: "textlabelclass", fieldclass: "form-control dpfieldclass", dataformater: "dateformatter", dpstyle: "style='max-width:180px;'" });
            self.scope.FormFields.push({ field: "StatingDate", fieldtype: "datetime", maxlenght: 160, ngmodel: "person.startdate", divclass: "col-md-12 form-group", labelclass: "textlabelclass", fieldclass: "form-control dpfieldclass", dataformater: "dateformatter", dpstyle: "style='max-width:180px;'" });
            self.scope.FormFields.push({ field: "Genre", fieldtype: "radio", maxlenght: 160, ngmodel: "person.genre", divclass: "col-md-12 form-group", radioclass: "radio-inline", labelclass: "textlabelclass", fieldclass: "form-control", radiolist: "Genres", valuefield: "id", showfield: "description" });
            self.scope.FormFields.push({ field: "Email", fieldtype: "email", maxlenght: 50, ngmodel: "person.email", divclass: "col-md-6 form-group", labelclass: "textlabelclass", fieldclass: "textfieldclass" });
            self.scope.FormFields.push({ field: "Education", fieldtype: "dropdownlist", ngmodel: "person.education", divclass: "col-md-6 form-group", labelclass: "textlabelclass", fieldclass: "textfieldclass", optionlist:"eItem.desc for eItem in education", dropindex:"0", labelstyle:"", "for":"", inputname:"" });


            self.scope.Genres = [];
            self.scope.Genres.push({ id: 1, description: "Male", checked:"checked"});
            self.scope.Genres.push({ id: 2, description: "Female", checked: "" });
            self.scope.Genres.push({ id: 3, description: "OtherOne", checked: "" });
            self.scope.Genres.push({ id: 4, description: "OtherTwo", checked: "" });

            self.scope.education = [];
            self.scope.education.push({ id: 1, desc: "Education1" });
            self.scope.education.push({ id: 2, desc: "Education2" });
            self.scope.education.push({ id: 3, desc: "Education3" });
            self.scope.education.push({ id: 4, desc: "Education4" });
            self.scope.education.push({ id: 5, desc: "Education5" });
            self.scope.education.push({ id: 6, desc: "Education6" });
            self.scope.education.push({ id: 7, desc: "Education7" });

        }
    }
}  