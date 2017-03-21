listo.controller('GraphCtrl', ["$scope", "ItemCrud", "graphCruncher", "dateCruncher", "$rootScope", "$interval", "$locale", '$timeout', "$q", "$sce", "$tooltip", "$state",
  function($scope, ItemCrud, graphCruncher, dateCruncher, $rootScope, $interval, $locale, $timeout, $q, $sce, $tooltip, $state) {

  // PUBLIC VARIABLES
    $scope.dataItems = ItemCrud.getDataItems();

    $scope.chartTip = {
      "title": "click on me to refresh the charts",
      "checked": false
    };

    $scope.items = ItemCrud.getAllItems();
    items = ItemCrud.getAllItems();

    var now = new Date(),
        nowNum = now.getTime(),
        weekNum = 604800000,

        weekAgoDateNum = nowNum - weekNum,
        weekAgoDateObj = new Date(weekAgoDateNum),
        weekAgoYear = weekAgoDateObj.getFullYear(),
        weekAgoMonth = weekAgoDateObj.getMonth(),
        weekAgoDate = weekAgoDateObj.getDate(),
        firstMomentPastWeekObj = new Date(weekAgoYear, weekAgoMonth, weekAgoDate, 0, 0, 0, 0),
        firstMomentPastWeekNum = firstMomentPastWeekObj.getTime(),
        lastMomentPastWeekNum = nowNum - 60000, // last moment of last week = a minute ago

        nextWeekDateNum = nowNum + weekNum,
        nextWeekDateObj = new Date(nextWeekDateNum),
        nextWeekYear = nextWeekDateObj.getFullYear(),
        nextWeekMonth = nextWeekDateObj.getMonth(),
        nextWeekDate = nextWeekDateObj.getDate(),
        lastMomentNextWeekObj = new Date(nextWeekYear, nextWeekMonth, nextWeekDate, 0, 0, 0),
        lastMomentNextWeekNum = lastMomentNextWeekObj.getTime();
        // nowNum = firstMomentNextWeekNum

    // Data-filtering Boolean string options =
    // "lastSeven"
    // "nextSeven"
    // "overall"
    // "isComplete"
    // "isNotComplete"
    // "isDue"
    // "isNotDue"

    $scope.count = function(timeFrame, completion, dueStatus) {
      var itemCount = 0;

      for (var i = 0; i < items.length; i++) {
        if (timeFrame == "lastSeven") {
          var weekBool = items[i].dueDate >= firstMomentPastWeekNum && items[i].dueDate < lastMomentPastWeekNum;
        } else if (timeFrame == "nextSeven") {
          var weekBool = items[i].dueDate >= nowNum && items[i].dueDate < lastMomentNextWeekNum;
        } else if (timeFrame == "overall") {
          var weekBool = true;
        }

        if (completion == "isComplete") {
          var completeBool = items[i].isComplete;
        } else if (completion == "isNotComplete") {
          var completeBool = !items[i].isComplete;
        }

        if (dueStatus == "isDue") {
          var dueBool = items[i].isPastDue;
        } else if (dueStatus == "isNotDue") {
          var dueBool = !items[i].isPastDue;
        }
        console.log("COUNT --> " + timeFrame + ": " + weekBool + ", " + completeBool + " (" + items[i].isComplete + "), " + dueBool + " (" + items[i].isPastDue + ") ");
        if (weekBool && completeBool && dueBool) {
          itemCount += 1;
        }
      }
      console.log("ITEMCOUNT: " + itemCount);
      return itemCount;
    };

    $scope.itemsWorkedCountLastSeven = function() {

      var itemCount = 0;
      items.forEach(function(item) {
        if (item.dueDate >= firstMomentPastWeekNum && item.dueDate < lastMomentPastWeekNum && item.isComplete && !item.isPastDue) {
          itemCount += 1;
        }
      });
      // console.log("itemsWorkedCountLastSeven: " + itemCount);
      return itemCount;
    };

    $scope.itemsLeftCountLastSeven = function() {

      var itemCount = 0;
      items.forEach(function(item) {
        if (item.dueDate >= firstMomentPastWeekNum && item.dueDate < lastMomentPastWeekNum && !item.isComplete && !item.isPastDue) {
          itemCount += 1;
        }
      });
      // console.log("itemsLeftCountLastSeven: " + itemCount);
      return itemCount;
    };

    $scope.itemsOverdueCountLastSeven = function() {
      var itemCount = 0;

      items.forEach(function(item) {
        if (item.dueDate >= firstMomentPastWeekNum && item.dueDate < lastMomentPastWeekNum && !item.isComplete && item.isPastDue) {
          itemCount += 1;
        }
      });
      return itemCount;
    };

    $scope.itemsDueCompleteCountLastSeven = function() {
      var itemCount = 0;

      items.forEach(function(item) {
        if (item.dueDate >= firstMomentPastWeekNum && item.dueDate < lastMomentPastWeekNum && item.isComplete && item.isPastDue) {
          itemCount += 1;
        }
      });
      return itemCount;
    };

    $scope.totalLastSeven = function() {
      var itemCount = 0;

      items.forEach(function(item) {
        if (item.dueDate >= firstMomentPastWeekNum && item.dueDate < lastMomentPastWeekNum) {
          itemCount += 1;
        }
      });
      return itemCount;
    };

    $scope.percentage = function() {
      return {
        worked: $scope.itemsWorkedCountLastSeven() / $scope.totalLastSeven() * 100,
        left: $scope.itemsLeftCountLastSeven() / $scope.totalLastSeven() * 100,
        due: $scope.itemsOverdueCountLastSeven() / $scope.totalLastSeven() * 100,
        dueComp: $scope.itemsDueCompleteCountLastSeven() / $scope.totalLastSeven() * 100,
        totalComp: ($scope.itemsWorkedCountLastSeven() + $scope.itemsDueCompleteCountLastSeven()) / $scope.totalLastSeven() * 100,
        totalIncomp: ($scope.itemsLeftCountLastSeven() + $scope.itemsOverdueCountLastSeven()) / $scope.totalLastSeven() * 100
      }
    };

    $scope.hoursWorkedLastSeven = function() {
      var hourCount = 0;
      var minCount = 0;

      items.forEach(function(item) {
        if (item.dueDate >= firstMomentPastWeekNum && item.dueDate < lastMomentPastWeekNum && item.isComplete && !item.isPastDue) {
          hourCount += item.eHour;
          minCount += item.eMinute;
        }
      });
      hourCount + Math.floor(minCount/60);
      return hourCount;
    };

    $scope.hoursLeftLastSeven = function() {
      var hourCount = 0;
      var minCount = 0;

      items.forEach(function(item) {
        if (item.dueDate >= firstMomentPastWeekNum && item.dueDate < lastMomentPastWeekNum && !item.isComplete && !item.isPastDue) {
          hourCount += item.eHour;
          minCount += item.eMinute;
        }
      });
      hourCount + Math.floor(minCount/60);
      return hourCount;
    };

    $scope.hoursOverdueLastSeven = function() {
      var hourCount = 0;
      var minCount = 0;

      items.forEach(function(item) {
        if (item.dueDate >= firstMomentPastWeekNum && item.dueDate < lastMomentPastWeekNum && !item.isComplete && item.isPastDue) {
          hourCount += item.eHour;
          minCount += item.eMinute;
        }
      });
      hourCount + Math.floor(minCount/60);
      return hourCount;
    };

    $scope.hoursDueCompleteLastSeven = function() {
      var hourCount = 0;
      var minCount = 0;

      items.forEach(function(item) {
        if (item.dueDate >= firstMomentPastWeekNum && item.dueDate < lastMomentPastWeekNum && item.isComplete && item.isPastDue) {
          hourCount += item.eHour;
          minCount += item.eMinute;
        }
      });
      hourCount + Math.floor(minCount/60);
      return hourCount;
    };




    // $scope.completionData = function() {
    // var sortedTallyLastSeven = graphCruncher.sortAndTally("lastSeven");
    // var sortedTallyNextSeven = graphCruncher.sortAndTally("nextSeven");
    // var sortedTallyOverall = graphCruncher.sortAndTally("overall");
    //
    // // Dummy $scope values to hack the color scheme:
    //
    // $scope.w = 0;
    // $scope.x = 0;
    // $scope.y = 0;
    // $scope.z = 0;
    //
    // // Data for overall:
    //
    // $scope.itemLeftCountOverall = sortedTallyOverall.itemLeftCount;
    // $scope.hoursLeftOverall = sortedTallyOverall.hoursLeft;
    // $scope.minutesLeftOverall = sortedTallyOverall.minutesLeft;
    // $scope.millisecondsLeftOverall = sortedTallyOverall.millisecondsLeft;
    //
    // $scope.itemWorkedCountOverall = sortedTallyOverall.itemWorkedCount;
    // $scope.hoursWorkedOverall = sortedTallyOverall.hoursWorked;
    // $scope.minutesWorkedOverall = sortedTallyOverall.minutesWorked;
    // $scope.millisecondsWorkedOverall = sortedTallyOverall.millisecondsWorked;
    //
    // $scope.itemOverdueCountOverall = sortedTallyOverall.itemOverdueCount;
    // $scope.hoursOverdueOverall = sortedTallyOverall.hoursOverdue;
    // $scope.minutesOverdueOverall = sortedTallyOverall.minutesOverdue;
    // $scope.millisecondsOverdueOverall = sortedTallyOverall.millisecondsOverdue;
    //
    // $scope.itemDueCompleteCountOverall = sortedTallyOverall.itemDueCompleteCount;
    // $scope.hoursDueCompleteOverall = sortedTallyOverall.hoursDueComplete;
    // $scope.minutesDueCompleteOverall = sortedTallyOverall.minutesDueComplete;
    // $scope.millisecondsDueCompleteOverall = sortedTallyOverall.millisecondsDueComplete;
    //
    // $scope.totalItemCountOverall = sortedTallyOverall.totalItemCount;
    // $scope.totalCompleteCountOverall = sortedTallyOverall.totalCompleteCount;
    // $scope.totalIncompleteCountOverall = sortedTallyOverall.totalIncompleteCount;
    // $scope.totalOverdueCountOverall = sortedTallyOverall.totalOverdueCount;
    // $scope.totalOverdueCountOverall = sortedTallyOverall.totalNotOverdueCount;
    //
    // $scope.percentTotalIncompleteOverall = sortedTallyOverall.percentTotalIncomplete;
    // $scope.percentTotalCompleteOverall = sortedTallyOverall.percentTotalComplete;
    // $scope.percentTotalOverdueOverall = sortedTallyOverall.percentTotalOverdue;
    // $scope.percentItemsCompleteOnTimeOverall = sortedTallyOverall.percentItemsCompleteOnTime;
    // $scope.percentTotalIncompleteNotOverdueOverall = sortedTallyOverall.percentTotalIncompleteNotOverdue;
    // $scope.percentTotalOverdueNotCompleteOverall = sortedTallyOverall.percentTotalOverdueNotComplete;
    // $scope.percentTotalOverdueCompleteOverall = sortedTallyOverall.percentTotalOverdueComplete;
    //
    // // Graph labels for overall
    //
    // $scope.seriesOverall = ['overall'];
    //
    // // complete count Vs. incomplete count Vs. overdue count Vs. overdue but done count
    // $scope.itemDataOverall = [$scope.itemWorkedCountOverall, $scope.itemLeftCountOverall, $scope.itemOverdueCountOverall, $scope.itemDueCompleteCountOverall];
    // $scope.itemLabelsOverall = ["items completed", "items yet to complete", "items overdue", "items completed after deadline"];
    //
    // // hours worked, left, overdue, and overdue but complete
    // $scope.hourDataOverall = [$scope.hoursWorkedOverall, $scope.hoursLeftOverall, $scope.hoursOverdueOverall, $scope.hoursDueCompleteOverall];
    // $scope.hourLabelsOverall = ["hours worked", "hours yet to work", "hours overdue", "hours after deadline"];
    //
    // // Total complete Vs. Total incomplete:
    // $scope.itemDataCompleteIncompleteTotalOverall = [$scope.w, $scope.x, $scope.y, $scope.z, $scope.totalIncompleteCountOverall, $scope.totalCompleteCountOverall];
    // $scope.itemLabelsCompleteIncompleteTotalOverall = ["w", "x", "y", "z", "items yet to complete", "items completed"];
    //
    // // items overdue
    // $scope.itemDataOverdueCompleteDueTotalOverall = [$scope.totalOverdueCountOverall, $scope.totalOverdueCountOverall];
    // $scope.itemLabelsOverdueCompleteDueTotalOverall = ["items overdue", "items not yet due"];
    //
    // // Data for lastSeven:
    //
    // $scope.itemLeftCountLastSeven = sortedTallyLastSeven.itemLeftCount;
    // $scope.hoursLeftLastSeven = sortedTallyLastSeven.hoursLeft;
    // $scope.minutesLeftLastSeven = sortedTallyLastSeven.minutesLeft;
    // $scope.millisecondsLeftLastSeven = sortedTallyLastSeven.millisecondsLeft;
    //
    // $scope.itemWorkedCountLastSeven = sortedTallyLastSeven.itemWorkedCount;
    // $scope.hoursWorkedLastSeven = sortedTallyLastSeven.hoursWorked;
    // $scope.minutesWorkedLastSeven = sortedTallyLastSeven.minutesWorked;
    // $scope.millisecondsWorkedLastSeven = sortedTallyLastSeven.millisecondsWorked;
    //
    // $scope.itemOverdueCountLastSeven = sortedTallyLastSeven.itemOverdueCount;
    // $scope.hoursOverdueLastSeven = sortedTallyLastSeven.hoursOverdue;
    // $scope.minutesOverdueLastSeven = sortedTallyLastSeven.minutesOverdue;
    // $scope.millisecondsOverdueLastSeven = sortedTallyLastSeven.millisecondsOverdue;
    //
    // $scope.itemDueCompleteCountLastSeven = sortedTallyLastSeven.itemDueCompleteCount;
    // $scope.hoursDueCompleteLastSeven = sortedTallyLastSeven.hoursDueComplete;
    // $scope.minutesDueCompleteLastSeven = sortedTallyLastSeven.minutesDueComplete;
    // $scope.millisecondsDueCompleteLastSeven = sortedTallyLastSeven.millisecondsDueComplete;
    //
    // $scope.totalItemCountLastSeven = sortedTallyLastSeven.totalItemCount;
    // $scope.totalCompleteCountLastSeven = sortedTallyLastSeven.totalCompleteCount;
    // $scope.totalIncompleteCountLastSeven = sortedTallyLastSeven.totalIncompleteCount;
    // $scope.totalOverdueCountLastSeven = sortedTallyLastSeven.totalOverdueCount;
    // $scope.totalNotOverdueCountLastSeven = sortedTallyLastSeven.totalNotOverdueCount;
    //
    // $scope.percentTotalIncompleteLastSeven = sortedTallyLastSeven.percentTotalIncomplete;
    // $scope.percentTotalCompleteLastSeven = sortedTallyLastSeven.percentTotalComplete;
    // $scope.percentTotalOverdueLastSeven = sortedTallyLastSeven.percentTotalOverdue;
    // $scope.percentItemsCompleteOnTimeLastSeven = sortedTallyLastSeven.percentItemsCompleteOnTime;
    // $scope.percentTotalIncompleteNotOverdueLastSeven = sortedTallyLastSeven.percentTotalIncompleteNotOverdue;
    // $scope.percentTotalOverdueNotCompleteLastSeven = sortedTallyLastSeven.percentTotalOverdueNotComplete;
    // $scope.percentTotalOverdueCompleteLastSeven = sortedTallyLastSeven.percentTotalOverdueComplete;

    // Graph labels for lastSeven


    // complete count Vs. incomplete count Vs. overdue count Vs. overdue but done count

    // $scope.itemWorkedCountLastSeven = itemWorkedCountLastSeven();
    // $scope.itemLeftCountLastSeven = itemLeftCountLastSeven(); $scope.itemOverdueCountLastSeven = itemOverdueCountLastSeven(); $scope.itemDueCompleteCountLastSeven = itemDueCompleteCountLastSeven();

    // itemsService.get = function() {
    //   return items;
    // };


    //
    // $scope.testData = function() {
    //   return 10;
    // }
    //
    // $scope.itemDataLastSeven = [$scope.testData(), $scope.testData(), $scope.testData(), $scope.testData()];

    // Dummy $scope values to hack the color scheme:

    $scope.w = 0;
    $scope.x = 0;
    $scope.y = 0;
    $scope.z = 0;

    $scope.$watch(getItems, watcherFunction, true);
      function getItems() {
        return ItemCrud.getAllItems();
    };

    function watcherFunction(newData) {
      console.log(newData);
      // items worked, left, overdue, and overdue but complete

      // $scope.itemDataLastSeven = [$scope.itemsWorkedCountLastSeven(), $scope.itemsLeftCountLastSeven(), $scope.itemsOverdueCountLastSeven(), $scope.itemsDueCompleteCountLastSeven()];

      $scope.itemDataLastSeven = [$scope.count("lastSeven", "isComplete", "isNotDue"), $scope.count("lastSeven", "isNotComplete", "isNotDue"), $scope.count("lastSeven", "isNotComplete", "isDue"), $scope.count("lastSeven", "isComplete", "isDue")];

      // $scope.itemDataLastSeven = [$scope.count1("lastSeven", "isComplete", "isNotDue"), $scope.count1("lastSeven", "isNotComplete", "isNotDue"), $scope.count1("lastSeven", "isNotComplete", "isDue"), $scope.count1("lastSeven", "isComplete", "isDue")];

      $scope.totalLastSeven();
      $scope.percentage();

      // hours worked, left, overdue, and overdue but complete
      $scope.hourDataLastSeven = [$scope.hoursWorkedLastSeven(), $scope.hoursLeftLastSeven(), $scope.hoursOverdueLastSeven(), $scope.hoursDueCompleteLastSeven()]
    };

    $scope.itemLabelsLastSeven = ["items completed", "items yet to complete", "items overdue", "items completed after deadline"];

    $scope.seriesLastSeven = ['last week'];

    // hours worked, left, overdue, and overdue but complete
    // $scope.hourDataLastSeven = [$scope.hoursWorkedLastSeven, $scope.hoursLeftLastSeven, $scope.hoursOverdueLastSeven, $scope.hoursDueCompleteLastSeven];

    $scope.hourLabelsLastSeven = ["hours worked", "hours yet to work", "hours overdue", "hours after deadline"];


    // Total complete Vs. Total incomplete:
    $scope.itemDataCompleteIncompleteTotalLastSeven = [$scope.w, $scope.x, $scope.y, $scope.z, $scope.totalIncompleteCountLastSeven, $scope.totalCompleteCountLastSeven];

    $scope.itemLabelsCompleteIncompleteTotalLastSeven = ["w", "x", "y", "z", "items yet to complete", "items completed"];

    // items overdue
    $scope.itemDataOverdueCompleteDueTotalLastSeven = [$scope.totalOverdueCountLastSeven, $scope.totalOverdueCountLastSeven];
    $scope.itemLabelsOverdueCompleteDueTotalLastSeven = ["items overdue", "items not yet due"];

    // // Data for nextSeven:
    //
    // $scope.itemLeftCountNextSeven = sortedTallyNextSeven.itemLeftCount;
    // $scope.hoursLeftNextSeven = sortedTallyNextSeven.hoursLeft;
    // $scope.minutesLeftNextSeven = sortedTallyNextSeven.minutesLeft;
    // $scope.millisecondsLeftNextSeven = sortedTallyNextSeven.millisecondsLeft;
    //
    // $scope.itemWorkedCountNextSeven = sortedTallyNextSeven.itemWorkedCount;
    // $scope.hoursWorkedNextSeven = sortedTallyNextSeven.hoursWorked;
    // $scope.minutesWorkedNextSeven = sortedTallyNextSeven.minutesWorked;
    // $scope.millisecondsWorkedNextSeven = sortedTallyNextSeven.millisecondsWorked;
    //
    // $scope.itemOverdueCountNextSeven = sortedTallyNextSeven.itemOverdueCount;
    // $scope.hoursOverdueNextSeven = sortedTallyNextSeven.hoursOverdue;
    // $scope.minutesOverdueNextSeven = sortedTallyNextSeven.minutesOverdue;
    // $scope.millisecondsOverdueNextSeven = sortedTallyNextSeven.millisecondsOverdue;
    //
    // $scope.itemDueCompleteCountNextSeven = sortedTallyNextSeven.itemDueCompleteCount;
    // $scope.hoursDueCompleteNextSeven = sortedTallyNextSeven.hoursDueComplete;
    // $scope.minutesDueCompleteNextSeven = sortedTallyNextSeven.minutesDueComplete;
    // $scope.millisecondsDueCompleteNextSeven = sortedTallyNextSeven.millisecondsDueComplete;
    //
    // $scope.totalItemCountNextSeven = sortedTallyNextSeven.totalItemCount;
    // $scope.totalCompleteCountNextSeven = sortedTallyNextSeven.totalCompleteCount;
    // $scope.totalIncompleteCountNextSeven = sortedTallyNextSeven.totalIncompleteCount;
    // $scope.totalOverdueCountNextSeven = sortedTallyNextSeven.totalOverdueCount;
    // $scope.totalOverdueCountNextSeven = sortedTallyNextSeven.totalNotOverdueCount;
    //
    // $scope.percentTotalIncompleteNextSeven = sortedTallyNextSeven.percentTotalIncomplete;
    // $scope.percentTotalCompleteNextSeven = sortedTallyNextSeven.percentTotalComplete;
    // $scope.percentTotalOverdueNextSeven = sortedTallyNextSeven.percentTotalOverdue;
    // $scope.percentItemsCompleteOnTimeNextSeven = sortedTallyNextSeven.percentItemsCompleteOnTime;
    // $scope.percentTotalIncompleteNotOverdueNextSeven = sortedTallyNextSeven.percentTotalIncompleteNotOverdue;
    // $scope.percentTotalOverdueNotCompleteNextSeven = sortedTallyNextSeven.percentTotalOverdueNotComplete;
    // $scope.percentTotalOverdueCompleteNextSeven = sortedTallyNextSeven.percentTotalOverdueComplete;
    //
    // // Graph labels for NextSeven
    //
    // $scope.seriesNextSeven = ['next week'];
    //
    // $scope.itemDataNextSeven = [$scope.itemWorkedCountNextSeven, $scope.itemLeftCountNextSeven, $scope.itemOverdueCountNextSeven, $scope.itemDueCompleteCountNextSeven];
    // $scope.itemLabelsNextSeven = ["items completed", "items yet to complete", "items overdue", "items completed after deadline"];
    //
    // // hours worked, left, overdue, and overdue but complete
    // $scope.hourDataNextSeven = [$scope.hoursWorkedNextSeven, $scope.hoursLeftNextSeven, $scope.hoursOverdueNextSeven, $scope.hoursDueCompleteNextSeven];
    // $scope.hourLabelsNextSeven = ["hours yet to work", "hours worked", "hours overdue", "hours after deadline"];
    //
    // // Total complete Vs. Total incomplete:
    // $scope.itemDataCompleteIncompleteTotalNextSeven = [$scope.w, $scope.x, $scope.y, $scope.z, $scope.totalIncompleteCountNextSeven, $scope.totalCompleteCountNextSeven];
    // $scope.itemLabelsCompleteIncompleteTotalNextSeven = ["w", "x", "y", "z", "items yet to complete", "items completed"];
    //
    // // items overdue
    // $scope.itemDataOverdueCompleteDueTotalNextSeven = [$scope.totalOverdueCountNextSeven, $scope.totalOverdueCountNextSeven];
    // $scope.itemLabelsOverdueCompleteDueTotalNextSeven = ["items overdue", "items not yet due"];
    //
    //
    //
    // $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    // $scope.series = ['Series A', 'Series B'];
    // $scope.data = [
    //   [65, 59, 80, 81, 56, 55, 40],
    //   [28, 48, 40, 19, 86, 27, 90]
    // ];
    // $scope.onClick = function (points, evt) {
    //   console.log(points, evt);
    // };
    // $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    // $scope.options = {
    //   scales: {
    //     yAxes: [
    //       {
    //         id: 'y-axis-1',
    //         type: 'linear',
    //         display: true,
    //         position: 'left'
    //       },
    //       {
    //         id: 'y-axis-2',
    //         type: 'linear',
    //         display: true,
    //         position: 'right'
    //       }
    //     ]
    //   }
    // };

    // };// end of completionData()

// The functions below are called by the different page links and refresh the graphs and remind the application to remove week-old items

    $scope.GraphCtrlRefreshTalliesAndData = function() {
    // $scope.completionData();

  };

// How to call a function from controller 1 in controller 2, got this from Stackoverflow:

    // app.controller('One', ['$scope', '$rootScope'
    // function($scope) {
    //     $rootScope.$on("CallParentMethod", function(){
    //        $scope.parentmethod();
    //     });
    //
    //     $scope.parentmethod = function() {
    //         // task
    //     }
    // }
    // ]);
    // app.controller('two', ['$scope', '$rootScope'
    //     function($scope) {
    //         $scope.childmethod = function() {
    //             $rootScope.$emit("CallParentMethod", {});
    //         }
    //     }
    // ]);





  }
]);
