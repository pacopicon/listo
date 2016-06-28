listo.controller('UserCtrl', ["$scope", "ItemCrud", "$rootScope",

    function($scope, ItemCrud, $rootScope) {

        $scope.items = ItemCrud.getAllItems();

        $scope.newDate = new Date();
        $scope.newTime = new Date();
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
        $scope.newHour = 0;
        $scope.newMinute = 0;
        $scope.newRank = 0;

        // $scope.rankAlgorithm = function(importanceRating, exponent) {
        //     $scope.newRank = ((((dueDateRating + importanceRating)/2)**exponent)/bigDivisor)
        // };
        //
        // $scope.updateRank = function() {
        //     var timeEstInSecs = (($scope.newHour * 60 * 60) + ($scope.newMinute * 60))
        //
        //     var timeTillDueDate =
        // };

        $scope.addItem = function() {
            ItemCrud.addItem($scope.newItemName, $scope.newDate.toJSON(), $scope.newTime.toJSON(), $scope.newHour, $scope.newMinute, $scope.newImportanceTxt, $scope.newRank);
        };

        // $scope.addItem.$watch(function() {
        //     // $scope.updateRank();
        //     console.log("This was a successful callback!");
        // });

    }
]);
