listo.controller('UserCtrl', ["$scope", "ItemCrud", "UserCrud", "graphCruncher", "dateCruncher", "modalService", "$rootScope", "$interval", "$log", "$http", "$locale", "$location", "$templateCache", '$timeout', "$q", "$sce", "$tooltip", "$popover", "$firebaseAuth",
  function($scope, ItemCrud, UserCrud, graphCruncher, dateCruncher, modalService, $rootScope, $interval, $log, $http, $locale, $location, $templateCache, $timeout, $q, $sce, $tooltip, $popover, $firebaseAuth) {

    // Remember, Firebase only accepts object, array, string, number, boolean, or null (see: https://www.firebase.com/docs/web/api/firebase/set.html)

    $scope.items = ItemCrud.getAllItems();
    // $scope.incompleteItems = ItemCrud.getIncompleteItems();

    var items = $scope.items;

    $scope.itemTally = function(items) {
      ItemCrud.checkItemArrayForCompletionStatus(items);
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

// Begin AngularStrap timePicker

    $scope.newDueDate = new Date(new Date().setMinutes(0, 0));

    $scope.updatedDueDate = new Date();

// End AngularStrap timePicker

// Begin Estimate

    $scope.hourwrap = {};
    $scope.hours = [
      {time: 0},
      {time: 1},
      {time: 2},
      {time: 3},
      {time: 4},
      {time: 5},
      {time: 6},
      {time: 7},
      {time: 8},
      {time: 9},
      {time: 10},
      {time: 11},
      {time: 12}
    ];

    $scope.minutewrap = {};
    $scope.minutes = [
      {time: 0},
      {time: 5},
      {time: 10},
      {time: 15},
      {time: 20},
      {time: 25},
      {time: 30},
      {time: 35},
      {time: 40},
      {time: 45},
      {time: 50},
      {time: 55}
    ];

// End Estimate

// Begin Importance

    $scope.iconwrap = {};
    $scope.icons = [
      {label:"<i class='fa fa-star'></i>"},
      {label:"<i class='fa fa-star'></i><i class='fa fa-star-half'></i>"},
      {label:"<i class='fa fa-star'></i><i class='fa fa-star'></i>"},
      {label:"<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-half'></i>"},
      {label:"<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i>"}
    ];

// End Importance

// Begin Custom Modal

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
          // oldItem seems to not be needed since functions below utilize item successfully.  However, I don't understand how yet, keeping it here until I do.
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

          if (item.q_completed) {
            ItemCrud.updateCompletion(item);
            ItemCrud.toggleItemToDelete(item);
            console.log("toggleItemToDelete fired");
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
      ItemCrud.addItem($scope.newItemName, $scope.newDueDate, $scope.iconwrap.selectedIcon, $scope.hourwrap.selectedHour, $scope.minutewrap.selectedMinute);
      console.log("importance is: " + $scope.selectedIcon);

      $scope.UserCtrlRefreshTalliesAndData();
    };

    $scope.toggleItemToDelete = function(item) {
      ItemCrud.toggleItemToDelete(item);
    };

    $scope.selectForDelete = function(items) {
      $scope.makeYellow = true;
      $scope.hideSelectAll = true;
      ItemCrud.toggleSelectForDelete(items);
    };

    $scope.undoSelectForDelete = function(items) {
      ItemCrud.toggleSelectForDelete(items);
      $scope.hideSelectAll = false;
      $scope.makeYellow = false;
    }

    $scope.deleteSelected = function() {
      for (var i = 0; i < items.length; i++ )
        if (!items[i].pp_isUnsafeToComplete) {
          $scope.updateCompletion(items[i]);
        }
    };

    $scope.updateCompletion = function(item) {
      ItemCrud.updateCompletion(item);

      $scope.UserCtrlRefreshTalliesAndData();
    };



// End CRUD Functions

  }
]);
