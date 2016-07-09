listo.controller('UserCtrl', ["$scope", "ItemCrud", "$rootScope", "$interval",
    function($scope, ItemCrud, $rootScope, $interval) {

        // time properties of the controller itself

        // Remember, Firebase only accepts object, array, string, number, boolean, or null (see: https://www.firebase.com/docs/web/api/firebase/set.html)

        $scope.items = ItemCrud.getAllItems();

        var refreshTime = function() {
            time = Date.now();
            $scope.time = time;
            $scope.currentTime = time;

            // exception: this below is updated to item elements
            ItemCrud.refreshTimeAndDatabase($scope.time);
        }
        refreshTime();
        $interval(refreshTime, 1000);

        $scope.newDueDate = new Date();
        $scope.newDueTime = new Date();
        $scope.newHourEst = 0;
        $scope.newMinuteESt = 0;
        $scope.newImportanceTxt = {
            repeatSelect: null,
            availableOptions: [
                {id: '1', text: "'not important at all'"},
                {id: '2', text: "'somewhat important'"},
                {id: '3', text: "'important'"},
                {id: '4', text: "'pretty important'"},
                {id: '5', text: "'job depends on it'"}
            ]
        };

        $scope.addItem = function() {
            ItemCrud.addItem($scope.newItemName, $scope.newDueDate, $scope.newDueTime, $scope.newHourEst, $scope.newMinuteEst,  $scope.newImportanceTxt);

        };

        $scope.updateDueTiming = function() {
            ItemCrud.updateDueTiming($scope.newDueDate)
        };

    }
]);
