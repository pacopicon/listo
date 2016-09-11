listo.controller('UserCtrl', ["$scope", "ItemCrud", "$rootScope", "$interval",
  function($scope, ItemCrud, $rootScope, $interval) {

    // time properties of the controller itself

    // Remember, Firebase only accepts object, array, string, number, boolean, or null (see: https://www.firebase.com/docs/web/api/firebase/set.html)

    $scope.items = ItemCrud.getAllItems();

    var refreshTime = function() {
      time = Date.now();
      $scope.time = time;
      return time;
    }

    $interval(refreshTime, 1000);

    $scope.parseTime = function(dueDate) {
      var timeLeftInMillisecs = ItemCrud.calculateTimeTillDueDate(dueDate, $scope.time);
      var countdown = ItemCrud.parseTime(timeLeftInMillisecs);
      return countdown;
    };

    $scope.newDueDate = new Date();
    $scope.newHourEst = 0;
    $scope.newMinuteESt = 0;

    // $scope.selectImportance = function() {
    //   $scope.importanceOptions = [
    //     {id: '1', text: "not important at all"},
    //     {id: '2', text: "somewhat important"},
    //     {id: '3', text: "important"},
    //     {id: '4', text: "pretty important"},
    //     {id: '5', text: "job depends on it"}
    //   ];
    //   $scope.selectedOption = $scope.importanceOptions[0];
    //   $scope.setOption = function(importanceOption) {
    //     $scope.selectedOption = importanceOption;
    //   };
    //   return $scope.selectedOption;
    // };

    $scope.newImportanceTxt = {
      repeatSelect: null,
      availableOptions: [
        {id: '1', text: "not important at all"},
        {id: '2', text: "somewhat important"},
        {id: '3', text: "important"},
        {id: '4', text: "pretty important"},
        {id: '5', text: "job depends on it"}
      ]
    };

    $scope.isCompleted = {
      value : true
    };

    // $scope.addItem = function() {
    //   ItemCrud.addItem($scope.newItemName, $scope.newDueDate, $scope.newHourEst, $scope.newMinuteEst,  $scope.newImportanceTxt);
    // };

    $scope.addItem = function() {
      ItemCrud.addItem($scope.newItemName, $scope.newDueDate, $scope.newHourEst, $scope.newMinuteEst,  $scope.newImportanceTxt);
    };

    $scope.updateDueTiming = function() {
      ItemCrud.updateDueTiming($scope.newDueDate)
    };
  }
]);
