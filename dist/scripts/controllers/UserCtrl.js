listo.controller('UserCtrl', ["$scope", "ItemCrud", "$rootScope", 'ModalService', "$interval", "$log", "$http", "$locale", "$templateCache", '$timeout',
  function($scope, ItemCrud, $rootScope, ModalService, $interval, $log, $http, $locale, $templateCache, $timeout) {

    $scope.items = ItemCrud.getAllItems();
    // $scope.incompleteItems = ItemCrud.getIncompleteItems();

    var items = $scope.items;

// begin Clock display function
    var refreshTime = function() {
      time = Date.now();
      $scope.time = time;
      return time;
    }

    $interval(refreshTime, 1000);
// end Clock display function

// begin item time pop-up: mousing over to do items will trigger a pop-up that displays more detailed info about the item.  This function displays more detailed time info.
    $scope.parseTime = function(dueDate) {
      var timeLeftInMillisecs = ItemCrud.calculateTimeTillDueDate(dueDate, $scope.time);
      var countdown = ItemCrud.parseTime(timeLeftInMillisecs);
      return countdown;
    };
// end item time pop-up

// begin current/previous year fn: if item due date year is current or previous year it will not display.
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
// end current/previous year fn:

// begin AngularStrap timePicker: this picks the item due date property ----------------

    $scope.newDueDate = new Date(new Date().setMinutes(0, 0));
    $scope.updatedDueDate = new Date();

// end AngularStrap timePicker------------------

// begin Est: sets the item estimated time to completion property in hours and minutes ------------------------------------
    $scope.newHourEst = 0;
    $scope.newMinuteEst = 0;
    $scope.timeOptions = {
      hour: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      minute: [0, 5, 10, 15, 25, 30, 45]
    };

// end Est--------------------------------------

// begin Importance: sets the importance priority property for the item -----------------------------

    $scope.selectedPhrase = "";
    $scope.selectedPhrases = [];
    $scope.phrases = [
      {text:"<i class='fa fa-star'></i>"},
      {text:"<i class='fa fa-star'></i><i class='fa fa-star-half'></i>"},
      {text:"<i class='fa fa-star'></i><i class='fa fa-star'></i>"},
      {text:"<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-half'></i>"},
      {text:"<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i>"}
    ];

    // {text:"not important at all"},
    // {text:"somewhat important"},
    // {text:"important"},
    // {text:"pretty important"},
    // {text:"job depends on it"}

// end Importance-----------------------------------------------

// begin Complex Modal: the following complex modal is an adaptation of Dave Kerr's complex modal (http://www.dwmkerr.com/the-only-angularjs-modal-service-youll-ever-need/).  It has my own modifications in order to adapt the modal into a an item property updater. -----------------

    $scope.showComplex = function(item) {
      $scope.oldItem = item;
      // begin console.log for modal step 1, which creates a modal pre-populated with the properties of the item selected to be updated
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
        // This instance of "close" receives the new updated item properties from the Modal controller and calls "ItemCrud.updateItem" below in order to $save those properties.
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
// end Complex Modal-------------------

// begin Completed: marks item as completed or incomplete. ----------------------------------------------

    $scope.isCompleted = false;

// end Completed----------------------------------------------

// begin CRUD Functions-------------------------------

    $scope.addItem = function() {
      ItemCrud.addItem($scope.newItemName, $scope.newDueDate, $scope.selectedPhrase, $scope.newHourEst, $scope.newMinuteEst);

      $scope.refreshTalliesAndData();
      // $scope.refreshCompletionData();
    };

    $scope.updateCompletion = function(item) {
      ItemCrud.updateCompletion(item);
      $scope.refreshTalliesAndData();
      // $scope.refreshCompletionData();
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
