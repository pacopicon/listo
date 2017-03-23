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

        var notDue = !items[i].isPastDue;
        var due = items[i].isPastDue;

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
        }
      }
      return {
        completeNotDue: completeNotDue,
        incompleteNotDue: incompleteNotDue,
        incompleteDue: incompleteDue,
        completeDue: completeDue,
        simplyComplete: completeNotDue + completeDue,
        simplyIncomplete: incompleteNotDue + incompleteDue,
        total: completeNotDue + incompleteNotDue + incompleteDue + completeDue,

        hoursCompleteNotDue: hoursCompleteNotDue + Math.floor(minCompleteNotDue/60),
        hoursIncompleteNotDue: hoursIncompleteNotDue + Math.floor(minIncompleteNotDue/60),
        hoursIncompleteDue: hoursIncompleteDue + Math.floor(minIncompleteDue/60),
        hoursCompleteDue: hoursCompleteDue + Math.floor(minCompleteDue/60)
      };
    };

    $scope.percentage = function(timeFrame) {
      total = $scope.count(timeFrame).total / 100;
      return {
        worked: $scope.count(timeFrame).completeNotDue / total,
        left: $scope.count(timeFrame).incompleteNotDue / total,
        due: $scope.count(timeFrame).incompleteDue / total,
        dueComp: $scope.count(timeFrame).completeDue / total,
        totalComp: $scope.count(timeFrame).simplyComplete / total,
        totalIncomp: $scope.count(timeFrame).simplyIncomplete / total
      };
    };

    $scope.itemDataCompleteIncompleteTotalLastSeven = [$scope.w, $scope.x, $scope.y, $scope.z, $scope.count("lastSeven").simplyComplete, $scope.count("lastSeven").simplyIncomplete];

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

      // LAST-SEVEN
      // for seeding percentage data in data-display:
      $scope.percentage("lastSeven");

      // chart 1: pie chart
      $scope.itemDataLastSeven = [$scope.count("lastSeven").completeNotDue, 0, $scope.count("lastSeven").incompleteDue, $scope.count("lastSeven").completeDue];

      // chart 2: hour bar chart
      $scope.hourDataLastSeven = [$scope.count("lastSeven").hoursCompleteNotDue, 0, $scope.count("lastSeven").hoursIncompleteDue, $scope.count("lastSeven").hoursCompleteDue]

      // chart 3: summary pie chart
      $scope.itemDataCompleteIncompleteTotalLastSeven = [$scope.w, $scope.x, $scope.y, $scope.z, $scope.count("lastSeven").simplyComplete, $scope.count("lastSeven").simplyIncomplete];

      // NEXT-SEVEN
      // for seeding percentage data in data-display:
      $scope.percentage("NextSeven");

      // chart 1: pie chart
      $scope.itemDataNextSeven = [$scope.count("NextSeven").completeNotDue, $scope.count("NextSeven").incompleteNotDue, $scope.count("NextSeven").incompleteDue, $scope.count("NextSeven").completeDue];

      // chart 2: hour bar chart
      $scope.hourDataNextSeven = [$scope.count("NextSeven").hoursCompleteNotDue, $scope.count("NextSeven").hoursIncompleteNotDue, $scope.count("NextSeven").hoursIncompleteDue, $scope.count("NextSeven").hoursCompleteDue]

      // chart 3: summary pie chart
      $scope.itemDataCompleteIncompleteTotalNextSeven = [$scope.w, $scope.x, $scope.y, $scope.z, $scope.count("NextSeven").simplyComplete, $scope.count("NextSeven").simplyIncomplete];

      // OVERALL
      // for seeding percentage data in data-display:
      $scope.percentage("overall");

      // chart 1: pie chart
      $scope.itemDataOverall = [$scope.count("overall").completeNotDue, $scope.count("overall").incompleteNotDue, $scope.count("overall").incompleteDue, $scope.count("overall").completeDue];

      // chart 2: hour bar chart
      $scope.hourDataOverall = [$scope.count("overall").hoursCompleteNotDue, $scope.count("overall").hoursIncompleteNotDue, $scope.count("overall").hoursIncompleteDue,  $scope.count("overall").hoursCompleteDue]

      // chart 3: summary pie chart
      $scope.itemDataCompleteIncompleteTotalOverall = [$scope.w, $scope.x, $scope.y, $scope.z, $scope.count("overall").simplyComplete, $scope.count("overall").simplyIncomplete];
    };

    // Chart Label ONLY for LAST-SEVEN

    $scope.itemLastSevenLabels = ["items completed", "items overdue", "items completed after deadline"];

    $scope.seriesLastSeven = ['last week'];


    // Chart Labels for LAST-SEVEN & NEXT-SEVEN & OVERALL

    $scope.itemLabels = ["items completed", "items not due & incomplete", "items overdue", "items completed after deadline"];

    $scope.hourLabels = ["hours worked", "hours left", "hours overdue", "hours after deadline"];

    $scope.itemTotalLabels = ["w", "x", "y", "z", "items yet to complete", "items completed"];

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
