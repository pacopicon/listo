listo.controller('UserCtrl', ["$scope", "ItemCrud", "$rootScope",

    function($scope, ItemCrud, $rootScope) {

        $scope.items = ItemCrud.getAllItems();

        $scope.newDueDate = new Date();
        $scope.newDueHour = 0;
        $scope.newDueMinute = 0;
        $scope.newAMorPM = {
            repeatSelect: null,
            availableOptions: [
                {id: '1', text: 'am'},
                {id: '2', text: 'pm'}
            ]
        };
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

        $scope.addItem = function() {
            var dueDateInSecs = $scope.newDueDate.getTime() / 1000;
            var timeTillDueDate = ItemCrud.calculateTimeTillDueDate(dueDateInSecs, $scope.newDueHour, $scope.newDueMinute, $scope.newAMorPM.repeatSelect);
            console.log("timeTillDueDate = " + timeTillDueDate);
            var estTime = ItemCrud.calculateEstTime($scope.newHourEst, $scope.newMinuteEst);
            console.log("estTime = " + estTime);
            var urgency = ItemCrud.calculateUrgency(timeTillDueDate, estTime);
            var processedRank = ItemCrud.calculateRank($scope.newImportanceTxt.repeatSelect, timeTillDueDate, estTime, urgency);

            ItemCrud.addItem($scope.newItemName, $scope.newDueDate.getTime(), timeTillDueDate, estTime, $scope.newImportanceTxt.repeatSelect, urgency, processedRank);
        };
    }
]);
