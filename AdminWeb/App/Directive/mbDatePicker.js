var Directive;
(function (Directive) {
    var spDatetimePicker = (function () {
        function spDatetimePicker($parse) {
            this.restrict = "E";
            this.replace = true;
            this.transclude = false;
            this.compile = function (element, attrs) {
                var modelAccessor = $parse(attrs.ngModel);
                var newElem = angular.element("<input class='form-control' id ='dtpck' type='text'></input>");
                element.replaceWith(newElem);
                return function (scope, element, attrs) {
                    var processChange = function () {
                        var date = new Date(element.datepicker("getDate").toString());
                        scope.$apply(function (scope) {
                            // Change bound variable
                            modelAccessor.assign(scope, date);
                        });
                    };
                    var dtOptions = {};
                    if (attrs.dtOptions)
                        dtOptions = attrs.dtOptions;
                    dtOptions.dateFormat = 'mm/dd/yy';
                    dtOptions.onClose = processChange;
                    dtOptions.onSelect = processChange;
                    dtOptions.changeMonth = true;
                    dtOptions.changeYear = true;
                    dtOptions.showButtonPanel = true;
                    dtOptions.currentText = "Today";
                    if (attrs["minDate"])
                        dtOptions.minDate = attrs["minDate"];
                    if (attrs["maxDate"])
                        dtOptions.maxDate = attrs["maxDate"];
                    if (attrs["yearRange"])
                        dtOptions.yearRange = attrs["yearRange"];
                    dtOptions.showAnim = "slide";
                    element.datepicker(dtOptions);
                    //scope.$watch(attrs.ngModel, function (newval, Oldval) {
                    //    alert("has changed" + newval + Oldval);
                    //})
                    scope.$watch(modelAccessor, function (val) {
                        var date = new Date(val);
                        element.datepicker("setDate", date);
                    });
                };
            };
        }
        return spDatetimePicker;
    })();
    Directive.spDatetimePicker = spDatetimePicker;
})(Directive || (Directive = {}));
//# sourceMappingURL=mbDatePicker.js.map