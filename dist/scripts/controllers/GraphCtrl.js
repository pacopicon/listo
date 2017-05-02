listo.controller('GraphCtrl', ["$scope", "ItemCrud", "dateCruncher", "$rootScope", "$interval", "$locale", '$timeout', "$q", "$sce", "$tooltip", "$state",
  function($scope, ItemCrud, dateCruncher, $rootScope, $interval, $locale, $timeout, $q, $sce, $tooltip, $state) {

  // PUBLIC VARIABLES
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
      var completeNotDue = 0,
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

        if (timeFrame == "lastSeven") {
          weekBool = items[i].dueDate >= firstMomentPastWeekNum && items[i].dueDate < lastMomentPastWeekNum;
        } else if (timeFrame == "nextSeven") {
          weekBool = items[i].dueDate >= nowNum && items[i].dueDate < lastMomentNextWeekNum;
        } else if (timeFrame == "overall") {
          weekBool = true;
        }

        var isComplete = items[i].isComplete;
        var isDue = items[i].isPastDue;

        // console.log("timeFrame: " + timeFrame + ", weekBool: " + weekBool + ", isComplete: " + isComplete + ", isDue: " + isDue);
        if (weekBool && isComplete && !isDue) {
          completeNotDue++;
          minCompleteNotDue = minCompleteNotDue + items[i].eMinute;
          hoursCompleteNotDue = hoursCompleteNotDue + items[i].eHour;
        } else if (weekBool && !isComplete && !isDue) {
          incompleteNotDue++;
          minIncompleteNotDue = minIncompleteNotDue + items[i].eMinute;
          hoursIncompleteNotDue = hoursIncompleteNotDue + items[i].eHour;
        } else if (weekBool && !isComplete && isDue) {
          incompleteDue++;
          minIncompleteDue = minIncompleteDue + items[i].eMinute;
          hoursIncompleteDue = hoursIncompleteDue + items[i].eHour;
        } else if (weekBool && isComplete && isDue) {
          completeDue++;
          minCompleteDue = minCompleteDue + items[i].eMinute;
          hoursCompleteDue = hoursCompleteDue + items[i].eHour;
        }
      }
      // console.log("incompleteNotDue " + incompleteNotDue);
      // console.log("nextWeek: " + lastMomentNextWeekObj.toString());

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
        worked: Math.round($scope.count(timeFrame).completeNotDue / total),
        left: Math.round($scope.count(timeFrame).incompleteNotDue / total),
        due: Math.round($scope.count(timeFrame).incompleteDue / total),
        dueComp: Math.round($scope.count(timeFrame).completeDue / total),
        totalComp: Math.round($scope.count(timeFrame).simplyComplete / total),
        totalIncomp: Math.round($scope.count(timeFrame).simplyIncomplete / total)
      };
    };

    // Dummy $scope values to hack chart.js color scheme:

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
      console.log("nextSeven completeNotDue: " + $scope.count("nextSeven").completeNotDue);
      console.log("nextSeven incompleteNotDue: " + $scope.count("nextSeven").incompleteNotDue);
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
      $scope.percentage("nextSeven");

      // chart 1: pie chart
      $scope.itemDataNextSeven = [$scope.count("nextSeven").completeNotDue, $scope.count("nextSeven").incompleteNotDue, $scope.count("nextSeven").incompleteDue, $scope.count("nextSeven").completeDue];

      // chart 2: hour bar chart
      $scope.hourDataNextSeven = [$scope.count("nextSeven").hoursCompleteNotDue, $scope.count("nextSeven").hoursIncompleteNotDue, $scope.count("nextSeven").hoursIncompleteDue, $scope.count("nextSeven").hoursCompleteDue]

      // chart 3: summary pie chart
      $scope.itemDataCompleteIncompleteTotalNextSeven = [$scope.w, $scope.x, $scope.y, $scope.z, $scope.count("nextSeven").simplyComplete, $scope.count("nextSeven").simplyIncomplete];

      // OVERALL
      // for seeding percentage data in data-display:
      $scope.percentage("overall");

      // chart 1: pie chart
      $scope.itemDataOverall = [$scope.count("overall").completeNotDue, $scope.count("overall").incompleteNotDue, $scope.count("overall").incompleteDue, $scope.count("overall").completeDue];

      // chart 2: hour bar chart
      $scope.hourDataOverall = [$scope.count("overall").hoursCompleteNotDue, $scope.count("overall").hoursIncompleteNotDue, $scope.count("overall").hoursIncompleteDue,  $scope.count("overall").hoursCompleteDue]

      // chart 3: summary pie chart
      $scope.itemDataCompleteIncompleteTotalOverall = [$scope.w, $scope.x, $scope.y, $scope.z, $scope.count("overall").simplyComplete, $scope.count("overall").simplyIncomplete];

      // chart 4: weekly comparison line chart
      $scope.itemsPer = [
        [$scope.count("lastSeven").completeNotDue, $scope.count("nextSeven").completeNotDue],
        [0, $scope.count("nextSeven").incompleteNotDue],
        [$scope.count("lastSeven").incompleteDue, $scope.count("nextSeven").incompleteDue],
        [$scope.count("lastSeven").completeDue, $scope.count("nextSeven").completeDue]
      ];
    };

    // Chart Label ONLY for LAST-SEVEN

    $scope.itemLastSevenLabels = ["completed", "overdue", "completed after deadline"];

    $scope.seriesLastSeven = ['last week'];


    // Chart Labels for LAST-SEVEN & NEXT-SEVEN & OVERALL

    $scope.itemLabels = ["completed", "incomplete", "overdue", "completed after deadline"];

    $scope.hourLabels = ["hours worked", "hours left", "hours overdue", "hours after deadline"];

    $scope.itemTotalLabels = ["w", "x", "y", "z", "all completed", "all incomplete"];

    $scope.weekLabels = ["last 7 days", "next 7 days"];

    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          },
          {
            id: 'y-axis-2',
            type: 'linear',
            display: true,
            position: 'right'
          }
        ]
      }
    };
  } // end of controller (don't erase)
]); // end of controller (don't erase)
