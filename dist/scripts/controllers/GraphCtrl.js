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
    // "lastSeven" = last week
    // "nextSeven" = next week
    // "overall" = both last and next week
    // "isComplete"
    // "isNotComplete"
    // "any" = both complete and incomplete
    // "isDue"
    // "isNotDue"
    // "any" = both due and not due

    $scope.count = function(timeFrame) {
      var completeNotDue = 0;
          incompleteNotDue = 0,
          incompleteDue = 0,
          completeDue = 0,
          simplyDue = 0,
          simplyComplete = 0,
          simplyIncomplete = 0,
          total = 0,

          hoursCompleteNotDue = 0,
          hoursIncompleteNotDue = 0,
          hoursIncompleteDue = 0,
          hoursCompleteDue = 0,

          minCompleteNotDue = 0,
          minIncompleteNotDue = 0,
          minIncompleteDue = 0,
          minCompleteDue = 0;

      for (var i = 0; i < items.length; i++) {

        if (timeFrame = "lastSeven") {
          weekBool = items[i].dueDate >= firstMomentPastWeekNum && items[i].dueDate < lastMomentPastWeekNum;
        } else if (timeFrame = "nextSeven") {
          weekBool = items[i].dueDate >= nowNum && items[i].dueDate < lastMomentNextWeekNum;
        } else if (timeFrame = "overall") {
          weekBool = true;
        }

        var complete = items[i].isComplete;
        var incomplete = !items[i].isComplete;
        var anyComplete = true;

        var notDue = !items[i].isPastDue;
        var due = items[i].isPastDue;
        var anyDue = true;

        // console.log("COUNT --> " + timeFrame + ": " + weekBool + ", " + completeBool + " (" + items[i].isComplete + "), " + dueBool + " (" + items[i].isPastDue + ") ");
        if (weekBool && complete && notDue) {
          completeNotDue++;
          minCompleteNotDue = minCompleteNotDue + items[i].eMinute;
          hoursCompleteNotDue = hoursCompleteNotDue + items[i].eHour;
        } else if (weekBool && incomplete && notDue) {
          incompleteNotDue++;
          minIncompleteNotDue = minIncompleteNotDue + items[i].eMinute;
          hoursIncompleteNotDue = hoursIncompleteNotDue + items[i].eHour;
        } else if (weekBool && incomplete && due) {
          incompleteDue++;
          minIncompleteDue = minIncompleteDue + items[i].eMinute;
          hoursIncompleteDue = hoursIncompleteDue + items[i].eHour;
        } else if (weekBool && complete && due) {
          completeDue++;
          minCompleteDue = minCompleteDue + items[i].eMinute;
          hoursCompleteDue = hoursCompleteDue + items[i].eHour;
        } else if (weekBool && complete && anyDue) {
          simplyComplete++;
        } else if (weekBool && incomplete && anyDue) {
          simplyIncomplete++;
        } else if (weekBool && anyComplete && anyDue) {
          total++;
        }
      }
      // console.log("ITEMCOUNT: " + itemCount);
      return {
        completeNotDue: completeNotDue,
        incompleteNotDue: incompleteNotDue,
        incompleteDue: incompleteDue,
        completeDue: completeDue,
        simplyComplete: simplyComplete,
        simplyIncomplete: simplyIncomplete,
        total: total,

        hoursCompleteNotDue: hoursCompleteNotDue + Math.floor(minCompleteNotDue/60),
        hoursIncompleteNotDue: hoursIncompleteNotDue + Math.floor(minIncompleteNotDue/60),
        hoursIncompleteDue: hoursIncompleteDue + Math.floor(minIncompleteDue/60),
        hoursCompleteDue: hoursCompleteDue + Math.floor(minCompleteDue/60)
      };
    };

    $scope.percentage = function() {
      return {
        worked: $scope.count("lastSeven").completeNotDue / $scope.count("lastSeven").total * 100,
        due: $scope.count("lastSeven").incompleteDue / $scope.count("lastSeven").total * 100,
        dueComp: $scope.count("lastSeven").completeDue / $scope.count("lastSeven").total * 100,
        totalComp: $scope.count("lastSeven").simplyComplete * 100,
        totalIncomp: $scope.count("lastSeven").simplyIncomplete * 100
      }
    };

    $scope.itemDataCompleteIncompleteTotalLastSeven = [$scope.w, $scope.x, $scope.y, $scope.z, $scope.count("lastSeven").simplyComplete, $scope.count("lastSeven").simplyIncomplete];

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

    $scope.totalIncompleteCountLastSeven = function() {
      return $scope.count("lastSeven", "isNotComplete", "isDue") / $scope.count("lastSeven", "any", "any");
    }

    $scope.totalCompleteCountLastSeven = function() {
      return ($scope.count("lastSeven", "isComplete", "isNotDue") + $scope.count("lastSeven", "isComplete", "isDue")) / $scope.count("lastSeven", "any", "any");
    }

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
      // data-seeding functions called here

      // for seeding percentage data in data-display:
      $scope.percentage();

      // lastSeven, chart 1: pie chart
      $scope.itemDataLastSeven = [$scope.count("lastSeven").completeNotDue, $scope.count("lastSeven").incompleteDue, $scope.count("lastSeven").completeDue];

      // lastSeven, chart 2: hour bar chart
      $scope.hourDataLastSeven = [$scope.count("lastSeven").hoursCompleteNotDue, $scope.count("lastSeven").hoursIncompleteDue, $scope.count("lastSeven").hoursCompleteDue]

      // lastSeven, chart 3: summary pie chart

      $scope.itemDataCompleteIncompleteTotalLastSeven = [$scope.w, $scope.x, $scope.y, $scope.z, $scope.count("lastSeven").simplyComplete, $scope.count("lastSeven").simplyIncomplete];
    };

    $scope.itemLabelsLastSeven = ["items completed", "items overdue", "items completed after deadline"];

    $scope.seriesLastSeven = ['last week'];

    // hours worked, left, overdue, and overdue but complete
    // $scope.hourDataLastSeven = [$scope.hoursWorkedLastSeven, $scope.hoursLeftLastSeven, $scope.hoursOverdueLastSeven, $scope.hoursDueCompleteLastSeven];

    $scope.hourLabelsLastSeven = ["hours worked", "hours overdue", "hours after deadline"];


    // Total complete Vs. Total incomplete:
    $scope.itemDataCompleteIncompleteTotalLastSeven = [$scope.w, $scope.x, $scope.y, $scope.z, $scope.totalIncompleteCountLastSeven, $scope.totalCompleteCountLastSeven];

    $scope.itemLabelsCompleteIncompleteTotalLastSeven = ["w", "x", "y", "z", "items yet to complete", "items completed"];

    // items overdue
    $scope.itemDataOverdueCompleteDueTotalLastSeven = [$scope.totalOverdueCountLastSeven, $scope.totalOverdueCountLastSeven];
    $scope.itemLabelsOverdueCompleteDueTotalLastSeven = ["items overdue", "items not yet due"];


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

  } // end of controller (don't erase)
]); // end of controller (don't erase)
