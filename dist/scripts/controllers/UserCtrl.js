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

      for (var i = 0; i < items.length; i++) {
        if (items[i].dueDate < time) {
          ItemCrud.updateAllItemsPastDue();
        }
      }
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
    // $scope.hours = [
    //   {time: 0},
    //   {time: 1},
    //   {time: 2},
    //   {time: 3},
    //   {time: 4},
    //   {time: 5},
    //   {time: 6},
    //   {time: 7},
    //   {time: 8},
    //   {time: 9},
    //   {time: 10},
    //   {time: 11},
    //   {time: 12}
    // ];

    $scope.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    $scope.minutewrap = {};
    // $scope.minutes = [
    //   {time: 0},
    //   {time: 5},
    //   {time: 10},
    //   {time: 15},
    //   {time: 20},
    //   {time: 25},
    //   {time: 30},
    //   {time: 35},
    //   {time: 40},
    //   {time: 45},
    //   {time: 50},
    //   {time: 55}
    // ];

    $scope.minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

// End Estimate

// Begin Importance

    $scope.iconwrap = {};

    // var string1 = "<i ng-class='{'redText': (item.isPastDue && !makeYellow), yellowText: makeYellow}' class='fa fa-star'></i>";
    // var string2 = "<i ng-class='{'redText': (item.isPastDue && !makeYellow), yellowText: makeYellow}' class='fa fa-star'></i><i class='fa fa-star-half'></i>";
    // var string3 = "<i ng-class='{'redText': (item.isPastDue && !makeYellow), yellowText: makeYellow}' class='fa fa-star'></i><i class='fa fa-star'></i>";
    // var string4 = "<i ng-class='{'redText': (item.isPastDue && !makeYellow), yellowText: makeYellow}' class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-half'></i>";
    // var string5 = "<i ng-class='{'redText': (item.isPastDue && !makeYellow), yellowText: makeYellow}' class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i>";
    //
    // $scope.trustAsHtml = function(string) {
    //   return $sce.trustAsHtml(string);
    // }
    //
    // $scope.icons = [
    //   {label: $scope.trustAsHtml(string1)},
    //   {label: $scope.trustAsHtml(string2)},
    //   {label: $scope.trustAsHtml(string3)},
    //   {label: $scope.trustAsHtml(string4)},
    //   {label: $scope.trustAsHtml(string5)}
    // ];

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
      console.log("step 1 - old name: " + $scope.oldItem.name + ", old date: " + new Date($scope.oldItem.dueDate) + ", Time: " + t.getMinutes() + ":" + t.getSeconds() + ":" + t.getMilliseconds());
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

          if (item.isComplete) {
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

    // $scope.isCompleted = false;

// Begin CRUD Functions

// Brought this over from GraphCtrl, since DOM makes many $scope calls to it and cannot simplify GraphCtrl into a service incjectable into the present controller.


    $scope.UserCtrlRefreshTalliesAndData = function() {
      // $scope.$broadcast("refreshData", {});
      ItemCrud.processOldCompleteItems();
      ItemCrud.updateAllItemsPastDue();
    };

    $scope.addItem = function() {
      ItemCrud.addItem($scope.newItemName, $scope.newDueDate, $scope.iconwrap.selectedIcon, $scope.hourwrap.selectedHour, $scope.minutewrap.selectedMinute);

      if ($scope.UserCtrlRefreshTalliesAndData()) {
        console.log("UserCtrlRefreshTalliesAndData was called");
      }
    };

    // var refreshData = function() {
    //   if ($scope.addItem()) {
    //     $scope.UserCtrlRefreshTalliesAndData();
    //   }
    // };

    // $scope.selectionInversion = function() {
    //   ItemCrud.checkIfAnySafe();
    // };

    $scope.toggleInvertAndSave = function(item) {

      if (!item.isSafeToComplete) {
        $scope.selectionInversion = false;
        console.log("selection IS inverted");
      } else {
        $scope.selectionInversion = true;
        console.log("selection IS NOT inverted");
      }
      items.$save(item);
    };

    // $scope.toggleItemToDelete = function(item) {
    //
    //   ItemCrud.toggleItemToDelete(item);
    //
    //   if (!item.isSafeToComplete) {
    //     $scope.selectionInversion = false;
    //     console.log("selection IS inverted");
    //   } else {
    //     $scope.selectionInversion = true;
    //     console.log("selection IS NOT inverted");
    //   }
    // };

    $scope.selectAllForDelete = function(items) {
      ItemCrud.toggleSelectForDelete(items);
      $scope.allSelected = true;
    };

    $scope.undoAllSelectForDelete = function(items) {
      ItemCrud.toggleSelectForDelete(items);
      $scope.allSelected = false;
    };

    $scope.invertSelectForDelete = function(items) {
      ItemCrud.toggleSelectForDelete(items);
    }

    $scope.deleteSelected = function() {
      for (var i = 0; i < items.length; i++)
        if (items[i].isComplete === false && items[i].isSafeToComplete === true) {
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
