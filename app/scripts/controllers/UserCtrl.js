listo.controller('UserCtrl', ["$scope", "ItemCrud", "$rootScope", "$interval", "$log", "$http", "$locale", "$templateCache", '$timeout',
  function($scope, ItemCrud, $rootScope, $interval, $log, $http, $locale, $templateCache, $timeout) {

    // Remember, Firebase only accepts object, array, string, number, boolean, or null (see: https://www.firebase.com/docs/web/api/firebase/set.html)

    $scope.items = ItemCrud.getAllItems();
    $scope.uncompletedItems = ItemCrud.getUncompletedItems();
    $scope.completedItems = ItemCrud.getCompletedItems();
    $scope.itemsPastDue = ItemCrud.getItemsPastDue();

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

    // db {
    //   users: {},
    //   tasks: {
    //     userId
    //   }
    // }

    // Begin AngularStrap Datepicker ---------------------------------------------


    // $scope.newDueDate = new Date();
    //
    // $scope.getType = function(key) {
    //   return Object.prototype.toString.call($scope[key]);
    // };
    //
    // $scope.clearDates = function() {
    //   $scope.newDueDate = null;
    // };

    // End AngularStrap Datepicker ---------------------------------------------

    // Begin Datepicker popup---------------------------------------------
    // $scope.today = function() {
    //   $scope.newDueDate = new Date();
    // };
    //
    // $scope.today();
    //
    // $scope.clear = function() {
    //   $scope.newDueDate = null;
    // };
    //
    // $scope.inlineOptions = {
    //   customClass: getDayClass,
    //   minDate: new Date(),
    //   showWeeks: true
    // };
    //
    // $scope.dateOptions = {
    //   dateDisabled: disabled,
    //   formatYear: 'yy',
    //   maxDate: new Date(2100, 5, 22),
    //   minDate: new Date(),
    //   startingDay: 1
    // };

    // function disabled(data) {
    //   var date = data.date,
    //     mode = data.mode;
    //   return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    // }
    //
    // $scope.toggleMin = function() {
    //   $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    //   $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    // };
    //
    // $scope.toggleMin();
    //
    // $scope.toggleWeekendDisable = function() {
    //   $scope.dateOptions.dateDisabled = $scope.dateOptions.dateDisabled ? null : disabled;
    // };
    //
    // $scope.toggleWeekendDisable();
    //
    // $scope.openDatePicker = function() {
    //   $scope.popup1.opened = true;
    // };
    //
    // $scope.setDate = function(year, month, day) {
    //   $scope.newDueDate = new Date(year, month, day);
    // };
    //
    // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    // $scope.format = $scope.formats[0];
    // $scope.altInputFormats = ['M!/d!/yyyy'];
    //
    // $scope.popup1 = {
    //   opened: false
    // };
    //
    // var tomorrow = new Date();
    // tomorrow.setDate(tomorrow.getDate() + 1);
    // var afterTomorrow = new Date();
    // afterTomorrow.setDate(tomorrow.getDate() + 1);
    //
    // $scope.events = [
    //   {
    //     date: tomorrow,
    //     status: 'full'
    //   },
    //   {
    //     date: afterTomorrow,
    //     status: 'partially'
    //   }
    // ];
    //
    // function getDayClass(data) {
    //   var date = data.date,
    //     mode = data.mode;
    //   if (mode === 'day') {
    //     var dayToCheck = new Date(date).setHours(0,0,0,0);
    //
    //     for (var i = 0; i < $scope.events.length; i++) {
    //       var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
    //
    //       if (dayToCheck === currentDay) {
    //         return $scope.events[i].status;
    //       }
    //     }
    //   }
    //
    //   return '';
    // }
    // End Datepicker popup----------------------------------------------


    // Begin AngularStrap timePicker-------------------------------------

    // $scope.newDueTime = new Date(1970, 0, 1, 10, 30, 40);

    $scope.newDueDate = new Date(new Date().setMinutes(0, 0));

    $scope.updatedDueDate = new Date();

    // End AngularStrap timePicker-------------------------------------

    // Begin uib-bootstrap Timepicker--------------------------------------------------
    // $scope.newDueTime = new Date();
    //
    // $scope.hstep = 1;
    // $scope.mstep = 15;
    //
    // // $scope.options = {
    // //   hstep: [1, 2, 3],
    // //   mstep: [1, 5, 10, 15, 25, 30]
    // // };
    //
    // $scope.ismeridian = true;
    // $scope.toggleMode = function() {
    //   $scope.ismeridian = ! $scope.ismeridian;
    // };
    //
    // $scope.update = function() {
    //   var d = new Date();
    //   d.setHours(17);
    //   d.setMinutes(0);
    //   $scope.newDueTime = d;
    // };
    //
    // $scope.changed = function() {
    //   $log.log("Time changed to: " + $scope.newDueTime);
    // };
    //
    // $scope.clear = function() {
    //   $scope.newDueTime = null;
    // };

    // End Timepicker--------------------------------------------------

    // Begin Est-------------------------------------------------------
    $scope.newHourEst = 0;
    $scope.newMinuteEst = 0;

    $scope.timeOptions = {
      hour: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      minute: [0, 5, 10, 15, 25, 30, 45]
    };

    // End Est-------------------------------------------------------

    // Begin Importance----------------------------------------------

    $scope.newImportanceTxt = {
      repeatSelect: "important",
      availableOptions: [
        {id: '1', text: "not important at all"},
        {id: '2', text: "somewhat important"},
        {id: '3', text: "important"},
        {id: '4', text: "pretty important"},
        {id: '5', text: "job depends on it"}
      ]
    };

    $scope.selectedPhrase = "";
    $scope.selectedPhrases = [];
    $scope.phrases = [
      {text:"not important at all"},
      {text:"somewhat important"},
      {text:"important"},
      {text:"pretty important"},
      {text:"job depends on it"}
    ];

    // End Importance-----------------------------------------------

    // Begin Completed----------------------------------------------

    $scope.isCompleted = false;

    // Begin Accordion options -------------------------------------------

    // $scope.oneAtATime = true;
    //
    // $scope.status = {
    //   isCustomHeaderOpen: false,
    //   isFirstOpen: true,
    //   isFirstDisabled: false
    // };
    //
    // $scope.toggleMin = function() {
    //   $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    //   $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    // };
    //
    // $scope.toggleMin();
    //
    // $scope.toggleWeekendDisable = function() {
    //   $scope.dateOptions.dateDisabled = $scope.dateOptions.dateDisabled ? null : disabled;
    // };
    //
    // $scope.toggleWeekendDisable();
    //
    // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    // $scope.format = $scope.formats[0];
    // $scope.altInputFormats = ['M!/d!/yyyy'];
    //
    // $scope.options = {
    //   hstep: [1, 2, 3],
    //   mstep: [1, 5, 10, 15, 25, 30]
    // };


    // End Accordion-----------------------------------------------------

    // Begin angularStrap modal -------------------------------------------



    // End angularStrap modal -------------------------------------------


    // Begin popover-----------------------------------------------------

    // $scope.dynamicPopover = {
    //   content: '',
    //   templateUrl: 'dateTimePickerPopover.html',
    //   title: 'choose date and time'
    // };
    //
    // $scope.placement = {
    //   options: [
    //     'top',
    //     'top-left',
    //     'top-right',
    //     'bottom',
    //     'bottom-left',
    //     'bottom-right',
    //     'left',
    //     'left-top',
    //     'left-bottom',
    //     'right',
    //     'right-top',
    //     'right-bottom'
    //   ],
    //   selected: 'top'
    // };

    // $scope.htmlPopover = $sce.trustAsHtml('<b style="color: red">I can</b> have <div class="label label-success">HTML</div> content');

    // End popover------------------------------------------

    // Begin CRUD Functions------------------------------------------
    // $scope.addItem = function() {
    //   ItemCrud.addItem($scope.newItemName, $scope.newDueDate, $scope.newDueTime, $scope.newHourEst, $scope.newMinuteEst, $scope.newImportanceTxt);
    // };

    $scope.addItem = function() {
      ItemCrud.addItem($scope.newItemName, $scope.newDueDate, $scope.selectedPhrase, $scope.newHourEst, $scope.newMinuteEst);
    };

    // if (typeof eachItem.b_dueDate === "object") {
    //         eachItem.b_dueDate = eachItem.b_dueDate.getTime();
    //     }

    $scope.updateItem = function(item, updatedDueDate, updatedImportance, updatedUrgency, updatedHour, updatedMinute) {
      ItemCrud.updateItem(item, updatedDueDate, updatedImportance, updatedUrgency, updatedHour, updatedMinute);
    };

    // Begin Tab Templates ---------------------------------------------

    // $scope.tabData   = [
    //   {
    //     heading: 'User',
    //     route:   'user'
    //   },
    //   {
    //     heading: 'UserCompleteItems',
    //     route:   'userCompleteItems',
    //     disable: false
    //   },
    //   {
    //     heading: 'UserWeekly',
    //     route:   'userWeekly',
    //     disable: false
    //   },
    //   {
    //     heading: 'UserMonthly',
    //     route:   'userMonthly',
    //     disable: false
    //   },
    //   {
    //     heading: 'UserYearly',
    //     route:   'userYearly',
    //     disable: false
    //   }
    // ];

    // $scope.tabData   = [
    //   {
    //     heading: 'Settings',
    //     route:   'user.settings'
    //   },
    //   {
    //     heading: 'Accounts',
    //     route:   'user.accounts',
    //     disable: true
    //   }
    // ];

    // Begin angular-chart.js -----------------------------------------

    $scope.labels = ["completed", "incomplete"];

    $scope.completeDataPoint = function() {
      if ($scope.completedItems !== undefined) {
          // console.log("completeDataPoint called, completedItems undefined, # of items completed: " + $scope.uncompletedItems.length);
        return $scope.completedItems.length;
      }
      else {
          // console.log("completeDataPoint called, completedItems is defined, # of items completed: " + $scope.uncompletedItems.length);
        return 0;
      }
    };

    $scope.incompleteDataPoint = function() {
      if ($scope.uncompletedItems !== undefined) {
        // console.log("incompleteDataPoint called, uncompletedItems undefined, # of items not complete: " + $scope.uncompletedItems.length);
        return $scope.uncompletedItems.length;
      }
      else {
        // console.log("incompleteDataPoint called, uncompletedItems is defined, # of items not complete: " + $scope.completedItems.length);
        return 0;
      }
    };

    $scope.data = [$scope.completeDataPoint(), $scope.incompleteDataPoint()];

  }
]);
