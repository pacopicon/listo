listo.controller('UserCtrl', ["$scope", "ItemCrud", "$rootScope",

    function($scope, ItemCrud, $rootScope) {

        $scope.items = ItemCrud.getAllItems();

        $scope.newDueDate = new Date();
        $scope.newDueTime = new Date();
        $scope.newHourEst = 0;
        $scope.newMinuteESt = 0;
        $scope.newImportanceTxt = {
            repeatSelect: null,
            availableOptions: [
                {id: '1', text: 'not important at all'},
                {id: '2', text: 'somewhat important'},
                {id: '3', text: 'important'},
                {id: '4', text: 'pretty important'},
                {id: '5', text: 'job depends on it'}
            ]
        };

// dueDateInSecs is now: correctedDueDateInSecs
        $scope.addItem = function() {

            var correctedDueDateInSecs = ItemCrud.setDueDateClockTime($scope.newDueDate, $scope.newDueTime) / 1000;
            var timeTillDueDate = ItemCrud.calculateTimeTillDueDate(correctedDueDateInSecs);
            var estTime = ItemCrud.calculateEstTime($scope.newHourEst, $scope.newMinuteEst);
            var urgency = ItemCrud.calculateUrgency(timeTillDueDate, estTime);
            var processedRank = ItemCrud.calculateRank($scope.newImportanceTxt.repeatSelect, timeTillDueDate, estTime, urgency);

            ItemCrud.addItem($scope.newItemName, correctedDueDateInSecs, timeTillDueDate, estTime, $scope.newImportanceTxt.repeatSelect, urgency, processedRank);
        };
    }
]);
