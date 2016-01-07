var Directive;
(function (Directive) {
    var OnlyNumber = (function () {
        function OnlyNumber() {
            this.link = function (scope, elm, attr) {
                $(elm).numeric();
            };
        }
        return OnlyNumber;
    })();
    Directive.OnlyNumber = OnlyNumber;
    var phoneInput = (function () {
        function phoneInput($filter, $browser) {
            this.require = 'ngModel';
            this.link = function ($scope, $element, $attrs, ngModelCtrl) {
                var listener = function () {
                    var value = $element.val().replace(/[^0-9]/g, '');
                    $element.val($filter('phonenumber')(value, false));
                };
                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function (viewValue) {
                    return viewValue.replace(/[^0-9]/g, '').slice(0, 10);
                });
                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    $element.val($filter('phonenumber')(ngModelCtrl.$viewValue, false));
                };
                $element.bind('change', listener);
                $element.bind('keydown', function (event) {
                    var key = event.keyCode;
                    // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                    // This lets us support copy and paste too
                    if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
                        return;
                    }
                    $browser.defer(listener); // Have to do this or changes don't get picked up properly
                });
                $element.bind('paste cut', function () {
                    $browser.defer(listener);
                });
            };
        }
        return phoneInput;
    })();
    Directive.phoneInput = phoneInput;
})(Directive || (Directive = {}));
//# sourceMappingURL=commonDirective.js.map