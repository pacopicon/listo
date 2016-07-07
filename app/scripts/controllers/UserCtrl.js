listo.controller('UserCtrl', ["$scope", "ItemCrud", "$rootScope", "$interval",
    function($scope, ItemCrud, $rootScope, $interval) {

        // time properties of the controller itself

        var refreshAndSaveTime = function() {
            time = Date.now();
            $scope.time = time;
            $scope.currentTime = time;

            // exception: this below is updated to item elements
            ItemCrud.saveCurrentTime($scope.time);
        }
        refreshAndSaveTime();
        $interval(refreshAndSaveTime, 1000);

        $scope.items = ItemCrud.getAllItems();
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
            var correctedDueDate = ItemCrud.setDueDateClockTime($scope.newDueDate, $scope.newDueTime);
            var timeTillDueDate = ItemCrud.calculateTimeTillDueDate(correctedDueDate);
            var estTime = ItemCrud.calculateEstTime($scope.newHourEst, $scope.newMinuteEst);
            var estTimeAsDateObj = ItemCrud.calculateEstTimeAsDateObj($scope.newHourEst, $scope.newMinuteEst);
            var ratio = ItemCrud.calculateTimeEstTimeTillDueRatio(timeTillDueDate, estTime);
            var urgency = ItemCrud.calculateUrgency(ratio);
            var urgencyTxt = ItemCrud.createUrgencyTxt(urgency);
            var rank = ItemCrud.calculateRank($scope.newImportanceTxt, ratio, urgency);

            ItemCrud.addItem($scope.newItemName, correctedDueDate, estTimeAsDateObj, $scope.newImportanceTxt, urgencyTxt, rank);

        };

      $scope.hoverIn = function () {
		      this.hoverEdit = true;
	    };

	    $scope.hoverOut = function () {
		      this.hoverEdit = false;
	    };
    }
]);
