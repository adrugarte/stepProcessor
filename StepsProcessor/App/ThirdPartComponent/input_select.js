/// <reference path="../scripts/typings/jquery.scrollto/jquery.scrollto.d.ts" />
var agInputSelect;
(function (agInputSelect) {
    var InputSelect = (function () {
        function InputSelect($filter, $document, $parse) {
            this.restrict = 'E';
            this.replace = true;
            this.scope = { inputName: '@', dropdownId: '@', startDropindex: '@' };
            this.require = 'ngModel';
            var displayFn;
            var valueName;
            var selectAs;
            var selectAsFn;
            var keyName;
            var groupByFn;
            var valueFn;
            var valuesFn;
            this.template = function (elem, attrs) {
                var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
                var optionsExp = attrs.isOptions;
                var inputName = attrs.inputName;
                var match;
                if (!(match = optionsExp.match(NG_OPTIONS_REGEXP))) {
                }
                displayFn = match[2] || match[1];
                valueName = match[4] || match[6];
                selectAs = / as /.test(match[0]) && match[1];
                selectAsFn = selectAs ? selectAs : null;
                keyName = match[5];
                groupByFn = match[3] || '';
                valueFn = match[2] ? match[1] : valueName;
                valuesFn = match[7];
                return '<div>' + '<div class="input-group-btn">' + '<input agdropdown type="text" class="form-control" name="{{ inputName }}" ng-model="inputValue" {{required}}/>' + '<ul class="dropdown-menu selectdropdown" id="{{dropdownId}}">' + '<li ng-repeat="' + valueName + ' in selectOptions | filter:{' + (inputName ? inputName : displayFn.replace(valueName + ".", "")) + ':inputValue}" id="{{' + valueName + '._searchIdx}}">' + '<a ng-click="itemSelected(' + valueName + ')">{{' + displayFn + '}}</a>' + '</li></ul></div></div>';
            };
            this.link = function (scope, elem, attr, ngModelCtrl) {
                var isPopupVisible = false;
                scope.selectedItem = {};
                scope.selectOptions = [];
                //add internal id to be able to manage selected items
                scope.$watch(function (scope) {
                    return scope.$parent[valuesFn];
                }, function (newValue, oldValue) {
                    if (newValue.length) {
                        scope.selectOptions = [];
                        var idx = 0;
                        angular.forEach(newValue, function (item) {
                            item._searchIdx = idx;
                            scope.selectOptions.push(item);
                            idx++;
                        });
                    }
                });
                scope.$watch(function (scope) {
                    return scope.inputValue;
                }, function (newValue, oldValue) {
                    var _newValue = newValue;
                    var _startDropindex = scope.startDropindex;
                    var _oldValue = (oldValue == undefined) ? "" : oldValue;
                    if (typeof _newValue != 'undefined') {
                        //console.log(_newValue + ' - ' + _oldValue);
                        if (_newValue.length > _oldValue.length && _newValue.length >= _startDropindex) {
                            if (scope.selectedItem['_searchIdx'] == undefined) {
                                isPopupVisible = false;
                            }
                            else {
                                //console.log("entro Aqui");
                                isPopupVisible = true;
                            }
                        }
                        else {
                            scope.selectedItem = {};
                            isPopupVisible = false;
                        }
                        if (isPopupVisible == false) {
                            angular.element('#' + scope.dropdownId, elem).show();
                        }
                        else {
                            angular.element('#' + scope.dropdownId, elem).hide();
                        }
                    }
                });
                if (isPopupVisible == false) {
                    elem.bind('keydown', function (e) {
                        var $listItems = angular.element(elem.find('ul li'));
                        var key = e.keyCode, $selected = $listItems.filter('.selected'), $current;
                        if (key != 40 && key != 38 && key != 13 && key != 9)
                            return;
                        $listItems.removeClass('selected');
                        if (key == 40) {
                            if (!$selected.length || $selected.is(':last-child')) {
                                if ($selected.is(':last-child')) {
                                    $current = $selected;
                                }
                                else {
                                    $current = $listItems.eq(0);
                                }
                            }
                            else {
                                $current = $selected.next();
                            }
                            $current.addClass('selected');
                            angular.element('#' + scope.dropdownId, elem).scrollTo('.selected');
                        }
                        else if (key == 38) {
                            if (!$selected.length || $selected.is(':first-child')) {
                                if ($selected.is(':first-child')) {
                                    $current = $selected;
                                }
                                else {
                                    $current = $listItems.last();
                                }
                            }
                            else {
                                $current = $selected.prev();
                            }
                            $current.addClass('selected');
                            angular.element('#' + scope.dropdownId, elem).scrollTo('.selected');
                        }
                        else if (key == 13) {
                            //scope.itemSelected($selected.text());
                            if ($selected.length != 0) {
                                scope.itemSelected($selected[0].id);
                                scope.$apply();
                            }
                        }
                        else if (key == 9) {
                            setValue();
                            angular.element('#' + scope.dropdownId, elem).hide();
                        }
                    });
                }
                var _currentscrollOffset = 0;
                $.fn.scrollTo = function (target, options, callback) {
                    if (typeof options == 'function' && arguments.length == 2) {
                        callback = options;
                        options = target;
                    }
                    var settings = $.extend({
                        scrollTarget: target,
                        offsetTop: 50,
                        duration: 0,
                        easing: 'linear'
                    }, options);
                    return this.each(function () {
                        var scrollPane = $(this);
                        var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
                        var scrollOffset = scrollTarget[0].offsetTop;
                        var scrollHeight = scrollPane[0].offsetHeight - scrollTarget[0].offsetHeight;
                        var scrollY = scrollOffset;
                        scrollPane.animate({ scrollTop: scrollY }, parseInt(settings.duration), settings.easing, function () {
                            if (typeof callback == 'function') {
                                callback.call(this);
                            }
                        });
                        if (scrollOffset > _currentscrollOffset + scrollHeight) {
                            _currentscrollOffset = _currentscrollOffset + scrollHeight;
                            scrollY = _currentscrollOffset;
                        }
                        else {
                            if (scrollOffset < _currentscrollOffset) {
                                _currentscrollOffset = _currentscrollOffset - scrollHeight;
                            }
                            scrollY = _currentscrollOffset;
                        }
                        scrollPane.animate({ scrollTop: scrollY }, parseInt(settings.duration), settings.easing, function () {
                            if (typeof callback == 'function') {
                                callback.call(this);
                            }
                        });
                    });
                };
                //sets item that is selected
                scope.itemSelected = function (selected) {
                    if (typeof selected === 'object') {
                        //is object
                        scope.selectedItem = $.grep(scope.selectOptions, function (e) {
                            return e._searchIdx == selected._searchIdx;
                        })[0];
                    }
                    else {
                        scope.selectedItem = $.grep(scope.selectOptions, function (e) {
                            return e._searchIdx == selected;
                        })[0];
                    }
                    if (scope.inputValue == scope.selectedItem[displayFn.replace(valueName + ".", "")])
                        angular.element('#' + scope.dropdownId, elem).hide();
                    else
                        scope.inputValue = scope.selectedItem[displayFn.replace(valueName + ".", "")];
                    if (selectAs == false) {
                        ngModelCtrl.$setViewValue(scope.selectedItem);
                    }
                    else {
                        ngModelCtrl.$setViewValue(scope.selectedItem[selectAs.replace(valueName + ".", "")]);
                    }
                };
                angular.element('input', elem).focus(function (event) {
                    var isClickedElementChildOfPopup = elem.find(event.target).length > 0;
                    if (isClickedElementChildOfPopup) {
                        if (scope.startDropindex == 0 && scope.selectedItem['_searchIdx'] == undefined)
                            angular.element('#' + scope.dropdownId, elem).show();
                    }
                });
                var setValue = function () {
                    if (scope.selectedItem['_searchIdx'] == undefined) {
                        if (scope.inputValue != undefined) {
                            //if (selectAs == false) {
                            var DisplayField = scope.inputName ? scope.inputName : displayFn.replace(valueName + ".", "");
                            var notFound = true;
                            angular.forEach(scope.selectOptions, function (option) {
                                if (notFound && option[DisplayField] && option[DisplayField] == scope.inputValue) {
                                    scope.selectedItem = option;
                                    notFound = false;
                                }
                            });
                            if (scope.selectedItem['_searchIdx'] == undefined) {
                                if (scope.inputValue) {
                                    for (var key in scope.selectOptions[0]) {
                                        scope.selectedItem[key] = key == DisplayField ? scope.inputValue : undefined;
                                    }
                                    ngModelCtrl.$setViewValue(scope.selectedItem);
                                }
                                else
                                    ngModelCtrl.$setViewValue(undefined);
                            }
                            else {
                                if (selectAs == false)
                                    ngModelCtrl.$setViewValue(scope.selectedItem);
                                else
                                    ngModelCtrl.$setViewValue(scope.selectedItem[selectAs.replace(valueName + ".", "")]);
                            }
                            scope.selectedItem = {};
                        }
                    }
                };
                $document.bind('click', function (event) {
                    var isClickedElementChildOfPopup = elem.find(event.target).length > 0;
                    if (isClickedElementChildOfPopup) {
                        if (scope.startDropindex == 0 && scope.selectedItem['_searchIdx'] == undefined)
                            angular.element('#' + scope.dropdownId, elem).show();
                        else
                            return;
                    }
                    else {
                        setValue();
                        angular.element('#' + scope.dropdownId, elem).hide();
                    }
                    scope.$apply();
                });
            };
        }
        return InputSelect;
    })();
    agInputSelect.InputSelect = InputSelect;
})(agInputSelect || (agInputSelect = {}));
var AgInputSelect;
(function (AgInputSelect) {
    "use strict";
    var AppBuilder = (function () {
        function AppBuilder(name) {
            this.app = angular.module(name, []);
            this.app.directive('agInputSelect', function ($filter, $document, $parse) {
                return new agInputSelect.InputSelect($filter, $document, $parse);
            });
        }
        return AppBuilder;
    })();
    AgInputSelect.AppBuilder = AppBuilder;
})(AgInputSelect || (AgInputSelect = {}));
new AgInputSelect.AppBuilder('AgInputSelectModule');
//# sourceMappingURL=input_select.js.map