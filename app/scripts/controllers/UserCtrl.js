listo.controller('UserCtrl', ["$scope", "ItemCrud", "UserCrud", "graphCruncher", "dateCruncher", "modalService", "$rootScope", "$interval", "$log", "$http", "$locale", "$location", "$templateCache", '$timeout', "$q", "$sce", "$tooltip", "$popover", "$firebaseAuth",
  function($scope, ItemCrud, UserCrud, graphCruncher, dateCruncher, modalService, $rootScope, $interval, $log, $http, $locale, $location, $templateCache, $timeout, $q, $sce, $tooltip, $popover, $firebaseAuth) {

    // Remember, Firebase only accepts object, array, string, number, boolean, or null (see: https://www.firebase.com/docs/web/api/firebase/set.html)

    $scope.items = ItemCrud.getAllItems();
    items = ItemCrud.getAllItems();

    $scope.dataItems = ItemCrud.getDataItems();
    var dataItems = ItemCrud.getDataItems();


    var now = new Date();

    var year = now.getFullYear();
    var month = now.getMonth();
    var nowNum = now.getTime();
    var weekNum = 604800000;
    var weekAgoDateNum = nowNum - weekNum;
    var weekAgoDateObj = new Date(weekAgoDateNum);
    var weekAgoDate = weekAgoDateObj.getDate();
    var firstMomentPastWeekObj = new Date(year, month, weekAgoDate, 0, 0, 0, 0);
    var firstMomentPastWeekNum = firstMomentPastWeekObj.getTime();

    var lastMomentPastWeekObj = nowNum - 60000; // last moment of last week was a minute ago
    var lastMomentPastWeekNum = new Date(lastMomentPastWeekObj);

    $scope.itemWorkedCountLastSeven = function() {

      var itemCount = 0;
      items.forEach(function(item) {
        if (item.dueDate >= firstMomentPastWeekNum && item.dueDate < lastMomentPastWeekNum && item.isComplete && !item.isPastDue) {
          itemCount += 1;
        }
      });
      return itemCount;
    };

    $scope.itemLeftCountLastSeven = function() {

      var itemCount = 0;
      items.forEach(function(item) {
        if (item.dueDate >= firstMomentPastWeekNum && item.dueDate < lastMomentPastWeekNum && !item.isComplete && !item.isPastDue) {
          itemCount += 1;
        }
      });
      return itemCount;
    };

    $scope.itemOverdueCountLastSeven = function() {
      var itemCount = 0;

      items.forEach(function(item) {
        if (item.dueDate >= firstMomentPastWeekNum && item.dueDate < lastMomentPastWeekNum && !item.isComplete && item.isPastDue) {
          itemCount += 1;
        }
      });
      return itemCount;
    };

    $scope.itemDueCompleteCountLastSeven = function() {
      var itemCount = 0;

      items.forEach(function(item) {
        if (item.dueDate >= firstMomentPastWeekNum && item.dueDate < lastMomentPastWeekNum && item.isComplete && item.isPastDue) {
          itemCount += 1;
        }
      });
      return itemCount;
    };

    $scope.$watch(getItems, watcherFunction, true);
      function getItems() {
        return ItemCrud.getAllItems();
    };

    function watcherFunction(newData) {
      console.log(newData);
      $scope.itemDataLastSeven = [$scope.itemWorkedCountLastSeven(), $scope.itemLeftCountLastSeven(), $scope.itemOverdueCountLastSeven(), $scope.itemDueCompleteCountLastSeven()];
    };

    // items.$loaded()
    //   .then(function() {
    //       $scope.itemDataLastSeven = [$scope.itemWorkedCountLastSeven(), $scope.itemLeftCountLastSeven(), $scope.itemOverdueCountLastSeven(), $scope.itemDueCompleteCountLastSeven()];
    //   })
    //   .catch(function(error) {
    //     console.log("Error:", error);
    //   });

    $scope.itemDataLastSeven = [$scope.itemWorkedCountLastSeven(), $scope.itemLeftCountLastSeven(), $scope.itemOverdueCountLastSeven(), $scope.itemDueCompleteCountLastSeven()];

    // $scope.itemDataLastSeven =
    //  [1, 2, 3, 4];

    $scope.itemLabelsLastSeven = ["items completed", "items yet to complete", "items overdue", "items completed after deadline"];


    var refreshTime = function() {
      time = Date.now();
      $scope.time = time;

      ItemCrud.updateAllItemsPastDue();
      ItemCrud.discardEmptyDataItems();

      return time;
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

      // var t = new Date();
      // console.log("step 1 - old name: " + $scope.oldItemName + ", old date: " + new Date($scope.oldItemDueDate) + ", Time: " + t.getMinutes() + ":" + t.getSeconds() + ":" + t.getMilliseconds());
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

          // var t = new Date();
          // console.log("step 4 - UserCtrl close: old name: " + $scope.oldItemName + ", new name: " + newItemProps.name + ", date: " + newItemProps.dueDate + ", Time: " + t.getMinutes() + ":" + t.getSeconds() + ":" + t.getMilliseconds());

          ItemCrud.updateItem($scope.oldItem, newName, newDueDate, newImportance, newUrgent, newHours, newMinutes);

          $scope.UserCtrlRefreshTalliesAndData();
        });
      });
    };
    // End Custom Modal-------------------

// Begin CRUD Functions

// Brought this over from GraphCtrl, since DOM makes many $scope calls to it and cannot simplify GraphCtrl into a service incjectable into the present controller.


    $scope.UserCtrlRefreshTalliesAndData = function() {
      ItemCrud.processOldCompleteItems();
    };

    $scope.addTestItem = function() {
      var day = new Date();
      var dueDate = day.setDate(17);
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
      } else if (!item.isSafeToComplete && itemCount > 1) {
        $scope.selectionInversion = true;
      } else if (item.isSafeToComplete && itemCount < 2 ) {
        $scope.allSelected = true;
      } else if (item.isSafeToComplete && itemCount > 1 ) {
        $scope.selectionInversion = false;
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
          var owner = "deleteSelected"
          var newDueDate = 0;
          var newhours = 0;
          var newMinutes = 0;
          $scope.updateCompletion(owner, items[i], newDueDate, newhours, newMinutes);
        }
    };

    $scope.updateCompletion = function(owner, item, newDueDate, newhours, newMinutes) {
      ItemCrud.updateCompletion(owner, item, newDueDate, newhours, newMinutes);

      $scope.UserCtrlRefreshTalliesAndData();
    };

    $scope.itemTally = function(items) {
      ItemCrud.checkItemArrayForCompletionStatus(items);
    };

// End CRUD Functions

  }
]);
