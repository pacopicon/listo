listo.controller('UserCtrl', ["$scope", "ItemCrud", "UserCrud", "graphCruncher", "dateCruncher", "modalService", "$rootScope", "$interval", "$log", "$http", "$locale", "$location", "$templateCache", '$timeout', "$q", "$sce", "$tooltip", "$popover", "$firebaseAuth",
  function($scope, ItemCrud, UserCrud, graphCruncher, dateCruncher, modalService, $rootScope, $interval, $log, $http, $locale, $location, $templateCache, $timeout, $q, $sce, $tooltip, $popover, $firebaseAuth) {

    // Remember, Firebase only accepts object, array, string, number, boolean, or null (see: https://www.firebase.com/docs/web/api/firebase/set.html)

    $scope.items = ItemCrud.getAllItems();
    $scope.dataItems = ItemCrud.getDataItems();

    var items = $scope.items;

    var refreshTime = function() {
      time = Date.now();
      $scope.time = time;


      for (var i = 0; i < items.length; i++) {
        if (!items[i].isPastDue && items[i].dueDate < time) {
          ItemCrud.updateAllItemsPastDue();
        } else if (items[i].isPastDue && items[i].dueDate > time) {
          ItemCrud.updateAllItemsPastDue();
        }
      }
      return time;
    };

    $scope.addOrUpdateDataItems = function(itemDueDate, prop1, prop2, prop3, value1, value2, value3) {
      ItemCrud.addOrUpdateDataItems(itemDueDate, prop1, prop2, prop3, value1, value2, value3);
    };

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

    $scope.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    $scope.minutewrap = {};

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
      $scope.oldItemName = item.name;
      $scope.oldItemDueDate = item.dueDate;
      $scope.oldItemHour = item.eHour;
      $scope.oldItemMinute = item.eMinute;
      $scope.oldItemIsComplete = item.isComplete;
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

          newName = newItemProps.newName;
          newDueDate = newItemProps.newDueDate;
          newImportance = newItemProps.newImportance;
          newUrgent = newItemProps.newUrgent;
          newHours = newItemProps.newHours;
          newMinutes = newItemProps.newMinutes;

          var t = new Date();
          console.log("step 4 - UserCtrl close: old name: " + $scope.oldItemName + ", new name: " + newItemProps.name + ", date: " + newItemProps.dueDate + ", Time: " + t.getMinutes() + ":" + t.getSeconds() + ":" + t.getMilliseconds());

          ItemCrud.updateItem($scope.oldItem, newName, newDueDate, newImportance, newUrgent, newHours, newMinutes);

          if ($scope.oldItemIsComplete) {
            // e.g. if Modal is executed from Archive with item as complete
            // updateCompletion also updates dataItems
            ItemCrud.updateCompletion($scope.oldItem);
            ItemCrud.toggleItemToDelete($scope.oldItem);
          } else if (!$scope.oldItemIsComplete) {
            // e.g. if Modal is executed with item as incomplete from To Do
            // incomplete item that is updated updates its new est hour and minute to dataItems.
            var hourDiff = newHours - $scope.oldItemHour;
            var minuteDiff = newMinutes - $scope.oldItemMinute;
            var dueDate = $scope.oldItemDueDate;

            ItemCrud.addOrUpdateDataItems(dueDate, "itemLeftCount", "hoursLeft", "minutesLeft", 0, hourDiff, minuteDiff);
          }

          $scope.UserCtrlRefreshTalliesAndData();
        });
      });

        };
    // End Custom Modal-------------------

// Begin CRUD Functions

// Brought this over from GraphCtrl, since DOM makes many $scope calls to it and cannot simplify GraphCtrl into a service incjectable into the present controller.


    $scope.UserCtrlRefreshTalliesAndData = function() {
      ItemCrud.processOldCompleteItems();
      // ItemCrud.updateAllItemsPastDue();
    };

    $scope.addTestItem = function() {
      var day = new Date();
      var dueDate = day.setDate(20);
      var dueDateObj = new Date(dueDate);
      var name = "test"
      ItemCrud.addItem(name, dueDateObj, "<i class='fa fa-star'></i>", 10, 10);
      // $scope.UserCtrlRefreshTalliesAndData();
    };

    // $scope.addItem = function() {
    //   ItemCrud.addItem($scope.newItemName, $scope.newDueDate, $scope.iconwrap.selectedIcon, $scope.hourwrap.selectedHour, $scope.minutewrap.selectedMinute);
    //   $scope.UserCtrlRefreshTalliesAndData();
    // };

    $scope.toggleInvertAndSave = function(item) {
      var itemCount = 0;

      for (i = 0; i < items.length; i++) {
        if (items[i]) {
          itemCount++;
        }
      }

      if (!item.isSafeToComplete && itemCount < 2) {
        $scope.allSelected = false;
        console.log("only one selection, so all are (it is) to be cleared");
      } else if (!item.isSafeToComplete && itemCount > 1) {
        $scope.selectionInversion = true;
        console.log("selection IS NOT ready to be inverted");
      } else if (item.isSafeToComplete && itemCount < 2 ) {
        $scope.allSelected = true;
        console.log("only one selection, so all are selected");
      } else if (item.isSafeToComplete && itemCount > 1 ) {
        $scope.selectionInversion = false;
        console.log("selection IS ready to be inverted");
      }
      items.$save(item);
    };

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

    $scope.itemTally = function(items) {
      ItemCrud.checkItemArrayForCompletionStatus(items);
    };

// End CRUD Functions

  }
]);
