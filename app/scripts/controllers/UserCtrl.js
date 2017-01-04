listo.controller('UserCtrl', ["$scope", "ItemCrud", "UserCrud", "graphCruncher", "dateCruncher", "modalService", "$rootScope", "$interval", "$log", "$http", "$locale", "$location", "$templateCache", '$timeout', "$q", "$sce", "$tooltip", "$popover", "$firebaseAuth",
  function($scope, ItemCrud, UserCrud, graphCruncher, dateCruncher, modalService, $rootScope, $interval, $log, $http, $locale, $location, $templateCache, $timeout, $q, $sce, $tooltip, $popover, $firebaseAuth) {

    // Remember, Firebase only accepts object, array, string, number, boolean, or null (see: https://www.firebase.com/docs/web/api/firebase/set.html)

    $scope.items = ItemCrud.getAllItems();
    // $scope.incompleteItems = ItemCrud.getIncompleteItems();

    var items = $scope.items;

    $scope.checkItemArrayForCompletionStatus = function() {
      var itemTally = ItemCrud.checkItemArrayForCompletionStatus(items);

      return itemTally;
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

    // Begin AngularStrap popover

    $scope.importanceTip = {
      "title": "rate importance with stars",
      "checked": false
    };

    $scope.dateTip = {
      "title": "enter estimated time to complete in hours",
      "checked": false
    };

    $scope.timeTip = {
      "title": "enter estimated time to complete in minutes",
      "checked": false
    };

    $scope.editDeleteTip = {
      "title": "click on me to edit, or check the item off and delete!",
      "checked": false
    };

    // End AngularStrap popover

    // Begin AngularStrap timePicker----------------

    $scope.newDueDate = new Date(new Date().setMinutes(0, 0));

    $scope.updatedDueDate = new Date();

    // End AngularStrap timePicker------------------

    // Begin Est------------------------------------
    $scope.newHourEst = 0;
    $scope.newMinuteEst = 0;

    $scope.hourOptions = [
      {hour: 0},
      {hour: 1},
      {hour: 2},
      {hour: 3},
      {hour: 4},
      {hour: 5},
      {hour: 6},
      {hour: 7},
      {hour: 8},
      {hour: 9},
      {hour: 10},
      {hour: 11},
      {hour: 12}
    ];

    $scope.minuteOptions = [
      {minute: 0},
      {minute: 5},
      {minute: 10},
      {minute: 15},
      {minute: 20},
      {minute: 25},
      {minute: 30},
      {minute: 35},
      {minute: 40},
      {minute: 45},
      {minute: 50},
      {minute: 55}
    ];

      // hour: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      // minute: [0, 5, 10, 15, 25, 30, 45]

    // End Est--------------------------------------

    // Begin Importance-----------------------------

    $scope.selectedPhrase = "";
    $scope.selectedPhrases = [];
    $scope.phrases = [];
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

    // End Importance-----------------------------------------------

    // Begin Custom Modal-----------------

    // Begin Custom Modal-----------------
    $scope.showComplex = function(item) {
      $scope.oldItem = item;
      var t = new Date();
      console.log("step 1 - old name: " + $scope.oldItem.a_text + ", old date: " + new Date($scope.oldItem.b_dueDate) + ", Time: " + t.getMinutes() + ":" + t.getSeconds() + ":" + t.getMilliseconds());
      // UserCtrl.js showComplex: item $id: -KUnjnUG90g4Ms_pkbC5 and name: short and item date 1478707118727

      modalService.showModal({
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
            ItemCrud.updateCompletion(oldItem);
          }

          $scope.UserCtrlRefreshTalliesAndData();
        });
      });

        };
    // End Custom Modal-------------------

    // End Custom Modal-------------------

    // Begin Completed----------------------------------------------

    $scope.isCompleted = false;

// Begin CRUD Functions

// Brought this over from GraphCtrl, since DOM makes many $scope calls to it and cannot simplify GraphCtrl into a service incjectable into the present controller.
    $scope.UserCtrlRefreshTalliesAndData = function() {
      $rootScope.$emit("refreshData", {});
    };

    $scope.addItem = function() {
      ItemCrud.addItem($scope.newItemName, $scope.newDueDate, $scope.selectedPhrase, $scope.newHourEst, $scope.newMinuteEst);

      $scope.UserCtrlRefreshTalliesAndData();
    };

    $scope.updateCompletion = function(item) {
      ItemCrud.updateCompletion(item);

      $scope.UserCtrlRefreshTalliesAndData();
    };



// End CRUD Functions

  }
]);
