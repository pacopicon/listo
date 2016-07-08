var textEditString =
    '<input class="inputText" type="text" ng-model="localModel" ng-enter="save()" ng-show="editState && type == \'inputText\'" />' +
    '</div>';

var dateEditString =
    '<input class="inputText" type="date" ng-model="localModel" ng-enter="save()" ng-show="editState && type == \'date\'" />' +
    '</div>';

var timeEditString =
    '<input class="inputText" type="time" ng-model="localModel" ng-enter="save()" ng-show="editState && type == \'time\'" />' +
    '</div>';

var numberEditString =
    '<input class="inputText" type="number" ng-model="localModel" ng-enter="save()" ng-show="editState && type == \'number\'" />' +
    '</div>';



var inputEditDirObj = function(typeEditString) {
    return {
        require: 'ngModel',
        scope: {
            model: '=ngModel',
            type: '@type'
        },
        replace: true,
        transclude: false,
        // includes our template
        template:
            '<div class="templateRoot">'+
                '<div class="hover-edit-trigger" title="click to edit">'+
                    '<div class="hover-text-field" ng-show="!editState" ng-click="toggle()">{{model}}<div class="edit-pencil glyphicon glyphicon-pencil"></div></div>'+
                    typeEditString +
                '<div class="edit-button-group pull-right" ng-show="editState">'+
                    '<div class="glyphicon glyphicon-ok"  ng-click="save()"></div>'+
                    '<div class="glyphicon glyphicon-remove" ng-click="cancel()"></div>'+
                '</div>'+
            '</div>',
        link: function (scope, element, attrs) {
            scope.editState = false;

            // make a local ref so we can back out changes, this only happens once and persists
            scope.localModel = scope.model;

            // apply the changes to the real model
            scope.save = function(){
                scope.model = scope.localModel;
                scope.toggle();
            };

            // don't apply changes
            scope.cancel = function(){
                scope.localModel = scope.model;
                scope.toggle();
            };

            /*
             * toggles the editState of our field
             */
            scope.toggle = function () {

                scope.editState = !scope.editState;

                /*
                 * a little hackish - find the "type" by class query
                 *
                 */
                var x1 = element[0].querySelector("."+scope.type);

                /*
                 * could not figure out how to focus on the text field, needed $timout
                 * http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field-in-angularjs
                 */
                $timeout(function(){
                    // focus if in edit, blur if not. some IE will leave cursor without the blur
                    scope.editState ? x1.focus() : x1.blur();
                }, 0);
            };
        }
    };
};

var inputTextEditDirObj = inputEditDirObj(textEditString);
var inputDateEditDirObj = inputEditDirObj(dateEditString);
var inputTimeEditDirObj = inputEditDirObj(timeEditString);
var inputNumberEditDirObj = inputEditDirObj(numberEditString);

// name must be a string
var dir = function(name, obj) {
    return listo.directive(name, function($timeout) {
        return obj;
    });
};

dir('clickToEditText', inputTextEditDirObj);
dir('clickToEditDate', inputDateEditDirObj);
dir('clickToEditTime', inputTimeEditDirObj);
dir('clickToEditNumber', inputNumberEditDirObj);

/*
 * seriously i would have never thought of this on my own, i don't think in directives yet
 * http://stackoverflow.com/questions/17470790/how-to-use-a-keypress-event-in-angularjs
 */
listo.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});
