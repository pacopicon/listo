listo.controller('UserCtrl', ["$scope", "ItemCrud", "$rootScope", 'ModalService', "$interval", "$log", "$http", "$locale", "$templateCache", '$timeout', "$q", "$sce", "$tooltip", "$popover",
  function($scope, ItemCrud, $rootScope, ModalService, $interval, $log, $http, $locale, $templateCache, $timeout, $q, $sce, $tooltip, $popover) {

    // Remember, Firebase only accepts object, array, string, number, boolean, or null (see: https://www.firebase.com/docs/web/api/firebase/set.html)

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
      if (!$scope.incompleteItems[0]) {
        return true;
      } else {
        return false;
      }
    };

    $scope.noinompleteItems = function() {
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

    // Begin AngularStrap popover

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

    // $scope.item = null;

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

      $scope.refreshTalliesAndData();
    };

    $scope.updateCompletion = function(item) {
      ItemCrud.updateCompletion(item);
      $scope.refreshTalliesAndData();
    };

    var completionData = function() {
      var sortedTallyLastSeven = ItemCrud.sortAndTally("lastSeven");
      var sortedTallyNextSeven = ItemCrud.sortAndTally("nextSeven");
      var sortedTallyOverall = ItemCrud.sortAndTally("overall");

      // Data for overall:

      $scope.itemLeftCountOverall = sortedTallyOverall.itemLeftCount;
      $scope.hoursLeftOverall = sortedTallyOverall.hoursLeft;
      $scope.minutesLeftOverall = sortedTallyOverall.minutesLeft;
      $scope.millisecondsLeftOverall = sortedTallyOverall.millisecondsLeft;

      $scope.itemWorkedCountOverall = sortedTallyOverall.itemWorkedCount;
      $scope.hoursWorkedOverall = sortedTallyOverall.hoursWorked;
      $scope.minutesWorkedOverall = sortedTallyOverall.minutesWorked;
      $scope.millisecondsWorkedOverall = sortedTallyOverall.millisecondsWorked;

      $scope.itemOverdueCountOverall = sortedTallyOverall.itemOverdueCount;
      $scope.hoursOverdueOverall = sortedTallyOverall.hoursOverdue;
      $scope.minutesOverdueOverall = sortedTallyOverall.minutesOverdue;
      $scope.millisecondsOverdueOverall = sortedTallyOverall.millisecondsOverdue;

      $scope.itemDueCompleteCountOverall = sortedTallyOverall.itemDueCompleteCount;
      $scope.hoursDueCompleteOverall = sortedTallyOverall.hoursDueComplete;
      $scope.minutesDueCompleteOverall = sortedTallyOverall.minutesDueComplete;
      $scope.millisecondsDueCompleteOverall = sortedTallyOverall.millisecondsDueComplete;

      $scope.totalItemCountOverall = sortedTallyOverall.totalItemCount;
      $scope.totalCompleteCountOverall = sortedTallyOverall.totalCompleteCount;
      $scope.totalIncompleteCountOverall = sortedTallyOverall.totalIncompleteCount;
      $scope.totalOverdueCountOverall = sortedTallyOverall.totalOverdueCount;
      $scope.totalOverdueCountOverall = sortedTallyOverall.totalNotOverdueCount;

      $scope.percentTotalIncompleteOverall = sortedTallyOverall.percentTotalIncomplete;
      $scope.percentTotalCompleteOverall = sortedTallyOverall.percentTotalComplete;
      $scope.percentTotalOverdueOverall = sortedTallyOverall.percentTotalOverdue;
      $scope.percentItemsCompleteOnTimeOverall = sortedTallyOverall.percentItemsCompleteOnTime;
      $scope.percentTotalIncompleteNotOverdueOverall = sortedTallyOverall.percentTotalIncompleteNotOverdue;
      $scope.percentTotalOverdueNotCompleteOverall = sortedTallyOverall.percentTotalOverdueNotComplete;
      $scope.percentTotalOverdueCompleteOverall = sortedTallyOverall.percentTotalOverdueComplete;

      // Graph labels for overall

      $scope.seriesOverall = ['overall'];

      $scope.itemDataOverall = [$scope.itemWorkedCountOverall, $scope.itemLeftCountOverall, $scope.itemOverdueCountOverall, $scope.itemDueCompleteCountOverall];
      $scope.itemLabelsOverall = ["items completed", "items yet to complete", "items overdue", "items completed after deadline"];

      $scope.hourDataOverall = [$scope.hoursWorkedOverall, $scope.hoursLeftOverall, $scope.hoursOverdueOverall, $scope.hoursDueCompleteOverall];
      $scope.hourLabelsOverall = ["hours yet to work", "hours worked", "hours overdue", "hours after deadline"];

      $scope.itemDataCompleteIncompleteTotalOverall = [$scope.totalIncompleteCountOverall, $scope.totalCompleteCountOverall];
      $scope.itemLabelsCompleteIncompleteTotalOverall = ["items yet to complete", "items completed"];

      $scope.itemDataOverdueCompleteDueTotalOverall = [$scope.totalOverdueCountOverall, $scope.totalOverdueCountOverall];
      $scope.itemLabelsOverdueCompleteDueTotalOverall = ["items overdue", "items not yet due"];

      // Data for lastSeven:

      $scope.itemLeftCountLastSeven = sortedTallyLastSeven.itemLeftCount;
      $scope.hoursLeftLastSeven = sortedTallyLastSeven.hoursLeft;
      $scope.minutesLeftLastSeven = sortedTallyLastSeven.minutesLeft;
      $scope.millisecondsLeftLastSeven = sortedTallyLastSeven.millisecondsLeft;

      $scope.itemWorkedCountLastSeven = sortedTallyLastSeven.itemWorkedCount;
      $scope.hoursWorkedLastSeven = sortedTallyLastSeven.hoursWorked;
      $scope.minutesWorkedLastSeven = sortedTallyLastSeven.minutesWorked;
      $scope.millisecondsWorkedLastSeven = sortedTallyLastSeven.millisecondsWorked;

      $scope.itemOverdueCountLastSeven = sortedTallyLastSeven.itemOverdueCount;
      $scope.hoursOverdueLastSeven = sortedTallyLastSeven.hoursOverdue;
      $scope.minutesOverdueLastSeven = sortedTallyLastSeven.minutesOverdue;
      $scope.millisecondsOverdueLastSeven = sortedTallyLastSeven.millisecondsOverdue;

      $scope.itemDueCompleteCountLastSeven = sortedTallyLastSeven.itemDueCompleteCount;
      $scope.hoursDueCompleteLastSeven = sortedTallyLastSeven.hoursDueComplete;
      $scope.minutesDueCompleteLastSeven = sortedTallyLastSeven.minutesDueComplete;
      $scope.millisecondsDueCompleteLastSeven = sortedTallyLastSeven.millisecondsDueComplete;

      $scope.totalItemCountLastSeven = sortedTallyLastSeven.totalItemCount;
      $scope.totalCompleteCountLastSeven = sortedTallyLastSeven.totalCompleteCount;
      $scope.totalIncompleteCountLastSeven = sortedTallyLastSeven.totalIncompleteCount;
      $scope.totalOverdueCountLastSeven = sortedTallyLastSeven.totalOverdueCount;
      $scope.totalNotOverdueCountLastSeven = sortedTallyLastSeven.totalNotOverdueCount;

      $scope.percentTotalIncompleteLastSeven = sortedTallyLastSeven.percentTotalIncomplete;
      $scope.percentTotalCompleteLastSeven = sortedTallyLastSeven.percentTotalComplete;
      $scope.percentTotalOverdueLastSeven = sortedTallyLastSeven.percentTotalOverdue;
      $scope.percentItemsCompleteOnTimeLastSeven = sortedTallyLastSeven.percentItemsCompleteOnTime;
      $scope.percentTotalIncompleteNotOverdueLastSeven = sortedTallyLastSeven.percentTotalIncompleteNotOverdue;
      $scope.percentTotalOverdueNotCompleteLastSeven = sortedTallyLastSeven.percentTotalOverdueNotComplete;
      $scope.percentTotalOverdueCompleteLastSeven = sortedTallyLastSeven.percentTotalOverdueComplete;

      // Graph labels for lastSeven

      $scope.seriesLastSeven = ['last week'];

      $scope.itemDataLastSeven = [$scope.itemWorkedCountLastSeven, $scope.itemLeftCountLastSeven, $scope.itemOverdueCountLastSeven, $scope.itemDueCompleteCountLastSeven];
      $scope.itemLabelsLastSeven = ["items completed", "items yet to complete", "items overdue", "items completed after deadline"];

      $scope.hourDataLastSeven = [$scope.hoursWorkedLastSeven, $scope.hoursLeftLastSeven, $scope.hoursOverdueLastSeven, $scope.hoursDueCompleteLastSeven];
      $scope.hourLabelsLastSeven = ["hours yet to work", "hours worked", "hours overdue", "hours after deadline"];

      $scope.itemDataCompleteIncompleteTotalLastSeven = [$scope.totalIncompleteCountLastSeven, $scope.totalCompleteCountLastSeven];
      $scope.itemLabelsCompleteIncompleteTotalLastSeven = ["items yet to complete", "items completed"];

      $scope.itemDataOverdueCompleteDueTotalLastSeven = [$scope.totalOverdueCountLastSeven, $scope.totalOverdueCountLastSeven];
      $scope.itemLabelsOverdueCompleteDueTotalLastSeven = ["items overdue", "items not yet due"];

      // Data for nextSeven:

      $scope.itemLeftCountNextSeven = sortedTallyNextSeven.itemLeftCount;
      $scope.hoursLeftNextSeven = sortedTallyNextSeven.hoursLeft;
      $scope.minutesLeftNextSeven = sortedTallyNextSeven.minutesLeft;
      $scope.millisecondsLeftNextSeven = sortedTallyNextSeven.millisecondsLeft;

      $scope.itemWorkedCountNextSeven = sortedTallyNextSeven.itemWorkedCount;
      $scope.hoursWorkedNextSeven = sortedTallyNextSeven.hoursWorked;
      $scope.minutesWorkedNextSeven = sortedTallyNextSeven.minutesWorked;
      $scope.millisecondsWorkedNextSeven = sortedTallyNextSeven.millisecondsWorked;

      $scope.itemOverdueCountNextSeven = sortedTallyNextSeven.itemOverdueCount;
      $scope.hoursOverdueNextSeven = sortedTallyNextSeven.hoursOverdue;
      $scope.minutesOverdueNextSeven = sortedTallyNextSeven.minutesOverdue;
      $scope.millisecondsOverdueNextSeven = sortedTallyNextSeven.millisecondsOverdue;

      $scope.itemDueCompleteCountNextSeven = sortedTallyNextSeven.itemDueCompleteCount;
      $scope.hoursDueCompleteNextSeven = sortedTallyNextSeven.hoursDueComplete;
      $scope.minutesDueCompleteNextSeven = sortedTallyNextSeven.minutesDueComplete;
      $scope.millisecondsDueCompleteNextSeven = sortedTallyNextSeven.millisecondsDueComplete;

      $scope.totalItemCountNextSeven = sortedTallyNextSeven.totalItemCount;
      $scope.totalCompleteCountNextSeven = sortedTallyNextSeven.totalCompleteCount;
      $scope.totalIncompleteCountNextSeven = sortedTallyNextSeven.totalIncompleteCount;
      $scope.totalOverdueCountNextSeven = sortedTallyNextSeven.totalOverdueCount;
      $scope.totalOverdueCountNextSeven = sortedTallyNextSeven.totalNotOverdueCount;

      $scope.percentTotalIncompleteNextSeven = sortedTallyNextSeven.percentTotalIncomplete;
      $scope.percentTotalCompleteNextSeven = sortedTallyNextSeven.percentTotalComplete;
      $scope.percentTotalOverdueNextSeven = sortedTallyNextSeven.percentTotalOverdue;
      $scope.percentItemsCompleteOnTimeNextSeven = sortedTallyNextSeven.percentItemsCompleteOnTime;
      $scope.percentTotalIncompleteNotOverdueNextSeven = sortedTallyNextSeven.percentTotalIncompleteNotOverdue;
      $scope.percentTotalOverdueNotCompleteNextSeven = sortedTallyNextSeven.percentTotalOverdueNotComplete;
      $scope.percentTotalOverdueCompleteNextSeven = sortedTallyNextSeven.percentTotalOverdueComplete;

      // Graph labels for NextSeven

      $scope.seriesNextSeven = ['next week'];

      $scope.itemDataNextSeven = [$scope.itemWorkedCountNextSeven, $scope.itemLeftCountNextSeven, $scope.itemOverdueCountNextSeven, $scope.itemDueCompleteCountNextSeven];
      $scope.itemLabelsNextSeven = ["items completed", "items yet to complete", "items overdue", "items completed after deadline"];

      $scope.hourDataNextSeven = [$scope.hoursWorkedNextSeven, $scope.hoursLeftNextSeven, $scope.hoursOverdueNextSeven, $scope.hoursDueCompleteNextSeven];
      $scope.hourLabelsNextSeven = ["hours yet to work", "hours worked", "hours overdue", "hours after deadline"];

      $scope.itemDataCompleteIncompleteTotalNextSeven = [$scope.totalIncompleteCountNextSeven, $scope.totalCompleteCountNextSeven];
      $scope.itemLabelsCompleteIncompleteTotalNextSeven = ["items yet to complete", "items completed"];

      $scope.itemDataOverdueCompleteDueTotalNextSeven = [$scope.totalOverdueCountNextSeven, $scope.totalOverdueCountNextSeven];
      $scope.itemLabelsOverdueCompleteDueTotalNextSeven = ["items overdue", "items not yet due"];

    };

// The functions below are called by the different page links and refresh the graphs and remind the application to remove week-old items
    $scope.refreshTalliesAndData = function() {
      completionData();
      ItemCrud.processOldCompleteItems();
      ItemCrud.updateAllItemsPastDue();
    };
  }
]);
