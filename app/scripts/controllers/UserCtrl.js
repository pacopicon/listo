listo.controller('UserCtrl', ["$scope", "ItemCrud", "$rootScope", 'ModalService', "$interval", "$log", "$http", "$locale", "$templateCache", '$timeout',
  function($scope, ItemCrud, $rootScope, ModalService, $interval, $log, $http, $locale, $templateCache, $timeout) {

    // Remember, Firebase only accepts object, array, string, number, boolean, or null (see: https://www.firebase.com/docs/web/api/firebase/set.html)

    $scope.items = ItemCrud.getAllItems();
    // $scope.incompleteItems = ItemCrud.getIncompleteItems();

    var items = $scope.items;

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

    // db {
    //   users: {},
    //   tasks: {
    //     userId
    //   }
    // }




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
    $scope.newImportanceTxt = {
      repeatSelect: "important",
      availableOptions: [
        {id: '1', text: "not important at all"},
        {id: '2', text: "somewhat important"},
        {id: '3', text: "important"},
        {id: '4', text: "pretty important"},
        {id: '5', text: "job depends on it"}
      ]
    };

    $scope.selectedPhrase = "";
    $scope.selectedPhrases = [];
    $scope.phrases = [
      {text:"not important at all"},
      {text:"somewhat important"},
      {text:"important"},
      {text:"pretty important"},
      {text:"job depends on it"}
    ];

    // End Importance-----------------------------------------------

    // Begin Custom Modal-----------------

    // $scope.item = null;

    $scope.showComplex = function(item) {
      var oldItem = item;
      var t = new Date();
      console.log("step 1 - old name: " + oldItem.a_text + ", old date: " + new Date(oldItem.b_dueDate) + ", Time: " + t.getMinutes() + ":" + t.getSeconds() + ":" + t.getMilliseconds());
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

          newName = newItemProps.name;
          newDueDate = newItemProps.dueDate;
          newImportance = newItemProps.importance;
          newUrgent = newItemProps.urgent;
          newHours = newItemProps.hours;
          newMinutes = newItemProps.minutes;

          var t = new Date();
          console.log("step 4 - UserCtrl close: old name: " + oldItem.name + ", new name: " + newName + ", date: " + newDueDate + ", Time: " + t.getMinutes() + ":" + t.getSeconds() + ":" + t.getMilliseconds());


        $scope.updateItem(oldItem, newName, newDueDate, newImportance, newUrgent, newHours, newMinutes);

        });
      });

    };


    // End Custom Modal-------------------

    // Begin Completed----------------------------------------------

    $scope.isCompleted = false;

    // Begin CRUD Functions-------------------------------

    $scope.addItem = function() {
      ItemCrud.addItem($scope.newItemName, $scope.newDueDate, $scope.selectedPhrase, $scope.newHourEst, $scope.newMinuteEst);

      $scope.completionData();
    };

    $scope.updateItem = function(item, updatedName, updatedDueDate, updatedImportance, updatedUrgency, updatedHour, updatedMinute) {
      ItemCrud.updateItem(item, updatedName, updatedDueDate, updatedImportance, updatedUrgency, updatedHour, updatedMinute);
    };

    $scope.updateItemCompletion = function(item, completion) {

      ItemCrud.updateItemCompletion(item, completion);

      $scope.completionData();

    };

    $scope.completionData = function() {
      $scope.incompleteItems = ItemCrud.itemsIncomplete().itemCount;
      $scope.millisecondsLeft = ItemCrud.itemsIncomplete().millisecondsLeft;
      $scope.hoursLeft = ItemCrud.itemsIncomplete().hoursLeft;
      $scope.minutesLeft = ItemCrud.itemsIncomplete().minutesLeft;

      $scope.completeItems = ItemCrud.itemsComplete().itemCount;
      $scope.millisecondsWorked = ItemCrud.itemsComplete().millisecondsWorked;
      $scope.hoursWorked = ItemCrud.itemsComplete().hoursWorked;
      // console.log("hoursWorked: " + $scope.hoursWorked);
      $scope.minutesWorked = ItemCrud.itemsComplete().minutesWorked;

      $scope.itemLabels = ["items yet to complete", "items completed"];
      $scope.itemData = [$scope.incompleteItems, $scope.completeItems];

      $scope.millisecLabels = ["amount of work yet to be done", "Amount of work done"];
      $scope.millisecData = [$scope.millisecondsWorked, $scope.millisecondsLeft];
      // $scope.millisecData = [$scope.hoursWorked, $scope.hoursLeft];
      $scope.series = ["Hours worked", "Hours yet to work"];
      $scope.hourData = [$scope.hoursWorked, $scope.hoursLeft];
      $scope.hourLabel = ["Hours worked", "Hours yet to work"]
    };

    $scope.itemLabels = ["items yet to complete", "items completed"];
    $scope.itemData = [$scope.incompleteItems, $scope.completeItems];

    $scope.millisecLabels = ["amount of work yet to be done", "Amount of work done"];
    $scope.millisecData = [$scope.millisecondsWorked, $scope.millisecondsLeft];

    // ui.bootstrap collapse

    // $scope.isNavCollapsed = true;
    $scope.isCollapsed = true;
    // $scope.isCollapsedHorizontal = false;

  }
]);
