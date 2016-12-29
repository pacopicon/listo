listo.controller('UserCtrl', ["$scope", "ItemCrud", "$rootScope", 'ModalService', "$interval", "$log", "$http", "$locale", "$templateCache", '$timeout',
  function($scope, ItemCrud, $rootScope, ModalService, $interval, $log, $http, $locale, $templateCache, $timeout) {

    $scope.items = ItemCrud.getAllItems();
    // $scope.incompleteItems = ItemCrud.getIncompleteItems();

    var items = $scope.items;

    var checkIfComplete = function(item) {
      if (item.q_completed == true) {
        return item;
      }
    };

    $scope.completeItems = items.filter(checkIfComplete);

    var checkIfNotComplete = function(item) {
      if (item.q_completed == false) {
        return item;
      }
    };

    $scope.incompleteItems = items.filter(checkIfNotComplete);

    $scope.noCompleteItems = function() {
      if (!$scope.completeItems[0]) {
        return true;
      } else {
        return false;
      }
    };

    $scope.noIncompleteItems = function() {
      if (!$scope.incompleteItems[0]) {
        return true;
      } else {
        return false;
      }
    };

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

    $scope.isCurrentOrPreviousYear = function(itemDueYear) {

      var currentTimeObj = new Date($scope.time);
      var CurrentYear = currentTimeObj.getFullYear();

      if (typeof itemDueYear == 'number') {
        var itemDueDate = new Date(itemDueYear);
        var itemDueYear = itemDueDate.getFullYear();
      } else {
        var itemDueYear = itemDueYear.getFullYear();
      }

      if (CurrentYear >= itemDueYear) {
        return true;
      } else {
        return false;
      }
    };

// Begin AngularStrap timePicker----------------

    $scope.newDueDate = new Date(new Date().setMinutes(0, 0));
    $scope.updatedDueDate = new Date();

// End AngularStrap timePicker------------------

// Begin Est------------------------------------
    $scope.newHourEst = 0;
    $scope.newMinuteEst = 0;
    $scope.timeOptions = {
      hour: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      minute: [0, 5, 10, 15, 25, 30, 45]
    };

// End Est--------------------------------------

// Begin Importance-----------------------------

    $scope.selectedPhrase = "";
    $scope.selectedPhrases = [];
    $scope.phrases = [
      {text:"*"},
      {text:"**"},
      {text:"***"},
      {text:"****"},
      {text:"*****"}
    ];

    // {text:"not important at all"},
    // {text:"somewhat important"},
    // {text:"important"},
    // {text:"pretty important"},
    // {text:"job depends on it"}

// End Importance-----------------------------------------------

// Begin Custom Modal-----------------

    $scope.showComplex = function(item) {
      $scope.oldItem = item;
      var t = new Date();
      console.log("step 1 - old name: " + $scope.oldItem.a_text + ", old date: " + new Date($scope.oldItem.b_dueDate) + ", Time: " + t.getMinutes() + ":" + t.getSeconds() + ":" + t.getMilliseconds());
      // UserCtrl.js showComplex: item $id: -KUnjnUG90g4Ms_pkbC5 and name: short and item date 1478707118727

      ModalService.showModal({
        templateUrl: "templates/modal.html",
        controller: "ModalController",
        inputs: {
          title: "Edit item",
          item: item
        }
      }).then(function(modal) {
        modal.element.modal();
        // This instance of "close" receives the new updated item properties from the Modal controller
        modal.close.then(function(newItemProps) {

          console.log("newItemProps: " + newItemProps);

          oldItem = $scope.oldItem;
          newName = newItemProps.newName;
          newDueDate = newItemProps.newDueDate;
          newImportance = newItemProps.newImportance;
          newUrgent = newItemProps.newUrgent;
          newHours = newItemProps.newHours;
          newMinutes = newItemProps.newMinutes;

          var t = new Date();
          console.log("step 4 - UserCtrl close: old name: " + oldItem.name + ", new name: " + newItemProps.name + ", date: " + newItemProps.dueDate + ", Time: " + t.getMinutes() + ":" + t.getSeconds() + ":" + t.getMilliseconds());

          ItemCrud.updateItem(item, newName, newDueDate, newImportance, newUrgent, newHours, newMinutes);

          if (oldItem.q_completed == true) {
            $scope.updateCompletion(oldItem);
          }
          $scope.refreshTalliesAndData();
        });
      });

    };


    // End Custom Modal-------------------

    // Begin Completed----------------------------------------------

    $scope.isCompleted = false;

    // Begin CRUD Functions-------------------------------

    $scope.addItem = function() {
      ItemCrud.addItem($scope.newItemName, $scope.newDueDate, $scope.selectedPhrase, $scope.newHourEst, $scope.newMinuteEst);

      // $scope.refreshCompletionData();
    };

    $scope.updateCompletion = function(item) {
      ItemCrud.updateCompletion(item);
      $scope.refreshCompletionData();
    };

    $scope.refreshCompletionData = function() {
      // $scope.incompleteItems = ItemCrud.tallyIncompleteItems().itemCount;
      // $scope.millisecondsLeft = ItemCrud.tallyIncompleteItems().millisecondsLeft;
      // $scope.hoursLeft = ItemCrud.tallyIncompleteItems().hoursLeft;
      // $scope.minutesLeft = ItemCrud.tallyIncompleteItems().minutesLeft;

      var incomItemTally = ItemCrud.tallyIncompleteItems();
      $scope.incomItemTally = incomItemTally.itemCount;
      $scope.hoursLeft = incomItemTally.hoursLeft;
      $scope.minutesLeft = incomItemTally.minutesLeft;
      $scope.millisecondsLeft = incomItemTally.millisecondsLeft;

      // $scope.completeItems = ItemCrud.tallyCompleteItems().itemCount;
      // $scope.millisecondsWorked = ItemCrud.tallyCompleteItems().millisecondsWorked;
      // $scope.hoursWorked = ItemCrud.tallyCompleteItems().hoursWorked;
      // $scope.minutesWorked = ItemCrud.tallyCompleteItems().minutesWorked;

      var comItemTally = ItemCrud.tallyCompleteItems();
      $scope.comItemTally = comItemTally.itemCount;
      $scope.hoursWorked = comItemTally.hoursWorked;
      $scope.minutesWorked = comItemTally.minutesWorked;
      $scope.millisecondsWorked = comItemTally.millisecondsWorked;

      $scope.itemLabels = ["items yet to complete", "items completed"];
      $scope.itemData = [$scope.incomItemTally, $scope.comItemTally];
      $scope.millisecLabels = ["amount of work yet to be done", "Amount of work done"];
      $scope.millisecData = [$scope.millisecondsWorked, $scope.millisecondsLeft];
      $scope.series = ["Hours worked", "Hours yet to work"];
      $scope.hourData = [$scope.hoursWorked, $scope.hoursLeft];
      $scope.hourLabel = ["Hours worked", "Hours yet to work"]
    };

      $scope.itemLabels = ["items yet to complete", "items completed"];
      $scope.itemData = [$scope.incomItemTally, $scope.comItemTally];

      $scope.millisecLabels = ["amount of work yet to be done", "Amount of work done"];
      $scope.millisecData = [$scope.millisecondsWorked, $scope.millisecondsLeft];

// This is not yet called
    $scope.processPastDueAndComplete = function() {
      ItemCrud.processOldCompleteItems();
      ItemCrud.updateAllItemsPastDue();
    };

    $scope.refreshTalliesAndData = function() {
      ItemCrud.processOldCompleteItems();
      ItemCrud.updateAllItemsPastDue();
      $scope.refreshCompletionData();
    };

  }
]);
