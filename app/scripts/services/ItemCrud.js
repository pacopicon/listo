listo.factory("ItemCrud", ["$firebaseArray", "FirebaseRef", "UserCrud",
  function($firebaseArray, FirebaseRef, UserCrud, DataCrud) {

// Public variables below
    // holds data as array of objects.  Each object is one item.
    var itemsRef = FirebaseRef.getItemsRef();
    var items = FirebaseRef.getItems();

    var dataItemsRef = FirebaseRef.getDataItemsRef();
    var dataItems = FirebaseRef.getDataItems();
    var dataWeekAgoRef = FirebaseRef.getDataWeekAgoRef();
    var dataWeekAgo = FirebaseRef.getDataWeekAgo();
    var dataNextWeekRef = FirebaseRef.getDataNextWeekRef();
    var dataNextWeek = FirebaseRef.getDataNextWeek();


    var now = new Date();
    var nowNum = now.getTime();
    var week = 604800000;

// Public functions below.

// if dataItems array is created for a specific day, 'addOrUpdateDataItems' updates it, otherwise it creates a new one.

    var updateWeeklyData = function(whichWeek, a_start, aa_end, beginWeek, endWeek, propArray, valArray) {

      whichWeek["a_start"] = a_start;
      whichWeek["aa_end"] = aa_end;
      whichWeek["beginWeek"] = beginWeek;
      whichWeek["endWeek"] = endWeek;

      // var allowSingularFilterDuplicate = function() {
      //
      //   var dupeCount = 0;
      //
      //   for (i = 0; i < propArray.length; i++) {
      //     if (whichWeek[propArray[i]] === valArray[i]) {
      //       dupeCount++;
      //       console.log("dupeCount: " + dupeCount);
      //     }
      //   }
      //   if (dupeCount != propArray.length) {
      //     for (i = 0; i < propArray.length; i++) {
      //       whichWeek[propArray[i]] = valArray[i];
      //       whichWeek.$save();
      //     }
      //   } else {
      //     console.log("attempted to log duplicate week Data");
      //   }
      // };

      if (!(typeof whichWeek === "undefined") && !(typeof propArray === "undefined") && !(typeof valArray === "undefined")) {

        for (i = 0; i < propArray.length; i++) {
          whichWeek[propArray[i]] = valArray[i];
        }
        // allowSingularFilterDuplicate();
        // console.log("called");
      }
    };

    var findMoment = function(itemDueDate) {
      var dateObj = new Date(itemDueDate);
      var year = dateObj.getFullYear();
      var month = dateObj.getMonth();
      var date = dateObj.getDate();
      var firstMomentObj = new Date(year, month, date, 0, 0, 0, 0);
      var firstMomentNum = firstMomentObj.getTime();
      var firstMomentString = firstMomentObj.toString();
      var lastMomentObj = new Date(year, month, date, 23, 59, 59, 999);
      var lastMomentNum = lastMomentObj.getTime();
      var lastMomentString = lastMomentObj.toString();

      return {
        firstObj: firstMomentObj,
        firstString: firstMomentString,
        firstNum: firstMomentNum,
        lastObj: lastMomentObj,
        lastString: lastMomentString,
        lastNum: lastMomentNum
      }
    };

    var sortDataIntoWeek = function(itemDueDate, propArray, valArray) {

      var dateObj = new Date();
      var minuteNow = dateObj.getMinutes();
      var hourNow = dateObj.getHours();
      var dateToday = dateObj.getDate();
      var year = now.getFullYear();
      var month = now.getMonth();
      var dateToday = now.getDate();

      var minuteBeforeNow = function() {
        var minuteBeforeNow = minuteNow - 1;
        if (minuteBeforeNow == 59) {
          var hourBeforeNow = hourNow - 1;
          var minuteBeforeNow = dateObj.setHours(hourBeforeNow);
          return {
            num: minuteBeforeNow,
            obj: new Date(minuteBeforeNow)
          };
        } else {
          var minuteBeforeNow = dateObj.setMinutes(minuteBeforeNow);
          return {
            num: minuteBeforeNow,
            obj: new Date(minuteBeforeNow)
          };
        }
      };

      var minuteAfterNow = function() {
        var minuteAfterNow = minuteNow + 1;
        if (minuteAfterNow == 0) {
          var hourAfterNow = hourNow + 1;
          var minuteAfterNow = dateObj.setHours(hourAfterNow);
          return {
            num: minuteAfterNow,
            obj: new Date(minuteAfterNow)
          };
        } else {
          var minuteAfterNow = dateObj.setMinutes(minuteAfterNow);
          return {
            num: minuteAfterNow,
            obj: new Date(minuteAfterNow)
          };
        }
      };

      var weekAgoDate = dateToday - 7;
      var firstMomentPastWeekObj = new Date(year, month, weekAgoDate, 0, 0, 0, 0);
      var firstMomentPastWeekString = firstMomentPastWeekObj.toString();
      var firstMomentPastWeekNum = firstMomentPastWeekObj.getTime();
      var lastMomentPastWeekObj = minuteBeforeNow().obj;
      var lastMomentPastWeekString = lastMomentPastWeekObj.toString();
      var lastMomentPastWeekNum = minuteBeforeNow().num;

      var dateWeekFromNow = dateToday + 7;
      var firstMomentNextWeekObj = minuteAfterNow().obj;
      var firstMomentNextWeekString = firstMomentNextWeekObj.toString();
      var firstMomentNextWeekNum = minuteAfterNow().num;
      var lastMomentNextWeekObj = new Date(year, month, dateWeekFromNow, 23, 59, 59, 999);
      var lastMomentNextWeekString = lastMomentNextWeekObj.toString();
      var lastMomentNextWeekNum = lastMomentNextWeekObj.getTime();

      if (itemDueDate > lastMomentNextWeekNum) {
        var isExecuted = false;
        if (!isExecuted) {
          return isExecuted = true;
          // console.log("ITEM DATE is too far into the future");
        }

      } else if (itemDueDate < firstMomentPastWeekNum) {

        var isExecuted = false;
        if (!isExecuted) {
          return isExecuted = true;
          // console.log("ITEM DATE is too far into the past");
        }
      } else if (itemDueDate >= firstMomentPastWeekNum && itemDueDate < lastMomentPastWeekNum) {
        // console.log("IF (dataWeekAgo) condition was called");
        var whichWeek = dataWeekAgo;
        var a_start = firstMomentPastWeekString;
        var aa_end = lastMomentPastWeekString;
        var beginWeek = firstMomentPastWeekNum;
        var endWeek = lastMomentPastWeekNum;

        updateWeeklyData(whichWeek, a_start, aa_end, beginWeek, endWeek, propArray, valArray);
      } else if (itemDueDate >= firstMomentNextWeekNum && itemDueDate < lastMomentNextWeekNum) {
        // console.log("ELSE (dataNextWeek) condition was called");
        var whichWeek = dataNextWeek;
        var a_start = firstMomentNextWeekString;
        var aa_end = lastMomentNextWeekString;
        var beginWeek = firstMomentNextWeekNum;
        var endWeek = lastMomentNextWeekNum;

        updateWeeklyData(whichWeek, a_start, aa_end, beginWeek, endWeek, propArray, valArray);
      }
    }; // end sortDataIntoWeek

    var updateDataItems = function(owner, itemDueDate, selectedDataItem, propArray, valArray) {

      sortDataIntoWeek(itemDueDate, propArray, valArray);

      var dateObj = new Date (itemDueDate);
      var dayOfMonth = dateObj.getDate();

      if (!(typeof selectedDataItem === "undefined") && !(typeof propArray === "undefined") && !(typeof valArray === "undefined")) {

        console.log("updateDataItems called by " + owner + ".");
        var iterateAndPrint = function(array) {
          for (i = 0; i < array.length; i++) {
            console.log("array[" + i + "]: " + array[i]);
          }
        };

        iterateAndPrint(propArray);
        iterateAndPrint(valArray);


        for (i = 0; i < propArray.length; i++) {
          selectedDataItem[propArray[i]] += valArray[i];
        }

        // dataItems.$save(selectedDataItem);
        dataItems.$save(selectedDataItem).then(function() {
        });

      }

    };

    var createNewDataItems = function(itemDueDate, propArray, valArray) {

      sortDataIntoWeek(itemDueDate, propArray, valArray);


      var matchProp = function(propName) {
        if (!(typeof propArray === "undefined") && !(typeof valArray === "undefined")) {
          for (i = 0; i < propArray.length; i++) {
            if (propName === propArray[i]) {
              return valArray[i];
            }
          }
        } else {
          return 0;
        }
      };

      dataItems.$add({
        a_start: findMoment(itemDueDate).firstString,
        aa_end: findMoment(itemDueDate).lastString,
        beginDay: findMoment(itemDueDate).firstNum,
        endDay: findMoment(itemDueDate).lastNum,
        itemLeftCount: matchProp("itemLeftCount") || 0,
        itemWorkedCount: matchProp("itemWorkedCount") || 0,
        itemOverdueCount: matchProp("itemOverdueCount") || 0,
        itemDueCompleteCount: matchProp("itemDueCompleteCount") || 0,
        hoursLeft: matchProp("hoursLeft") || 0,
        minutesLeft: matchProp("minutesLeft") || 0,
        hoursWorked: matchProp("hoursWorked") || 0,
        minutesWorked: matchProp("minutesWorked") || 0,
        hoursOverdue: matchProp("hoursOverdue") || 0,
        minutesOverdue: matchProp("minutesOverdue") || 0,
        hoursDueComplete: matchProp("hoursDueComplete") || 0,
        minutesDueComplete: matchProp("minutesDueComplete") || 0
      });
    };

    // var addOrUpdateDataItems = function(owner, itemDueDate, propArray, valArray) {
    //
    //   if (!(typeof dataItems[0] === "undefined")) {
    //
    //     for (i = 0; i < dataItems.length; i++) {
    //
    //       var endDay = dataItems[i].endDay;
    //       var beginDay = dataItems[i].beginDay;
    //
    //       if (itemDueDate >= beginDay && itemDueDate <= endDay) {
    //         updateDataItems(owner, itemDueDate, dataItems[i], propArray, valArray);
    //       } else {
    //         console.log("1st create fn called by " + owner);
    //         createNewDataItems(itemDueDate, propArray, valArray);
    //       }
    //
    //     }
    //   } else {
    //     console.log("2nd create fn called by " + owner);
    //     createNewDataItems(itemDueDate, propArray, valArray);
    //   }
    //
    // };

    var addOrUpdateDataItems = function(owner, itemDueDate, propArray, valArray) {

      // console.log("addOrUpdateDataItems called by " + owner + " with date: " + itemDueDate);

      if (!(typeof dataItems[0] === "undefined")) {

        for (var i = 0; i < dataItems.length; i++) {

          var endDay = dataItems[i].endDay;
          var beginDay = dataItems[i].beginDay;

          if (itemDueDate >= beginDay && itemDueDate <= endDay) {
            console.log("updateDataItems WIL BE called by " + owner + ". " + itemDueDate + " is >= than begin day, " + beginDay + ", and <= than endDay, " + endDay);

            updateDataItems(owner, itemDueDate, dataItems[i], propArray, valArray);

          } else if ((i == dataItems.length -1) && ( itemDueDate < beginDay || itemDueDate > endDay)) {

            console.log("1st createNewDataItems WILL BE called by " + owner + ". " + itemDueDate + " is < than begin day, " + beginDay + ", OR > than endDay, " + endDay);
            createNewDataItems(itemDueDate, propArray, valArray);
          }
        }
      } else {
        console.log("2nd createNewDataItems called by " + owner);
        createNewDataItems(itemDueDate, propArray, valArray);
      }

    };

// Public functions below.



// This function below returns 'urgencyTxt', which announces the urgency status of an item in the DOM
    var createUrgencyTxt = function(urgency) {
      if (urgency === true) {
        urgencyTxt = "yes";
      } else {
        urgencyTxt = "no";
      }
      return urgencyTxt;
    };

// -- RANK FUNCTIONS -- The functions below calculate parameters that influence an item's rank, i.e. the item's priority in the to do list.

// This function below returns 'estTime', the exact estimated Time amount in milliseconds and is used to calculate the 'ratio' in the subsequent function.
    var calculateEstTime = function(eHour, eMinute) {
      var estTime = (eHour * 60 * 60 * 1000) + (eMinute * 60 * 1000);
      return estTime;
    };
// This function below returns the 'ratio' between the estimated time to complete an item and the time remaining till its due date.  'ratio' is one of three parameters used to calculate Rank.
    var calculateTimeEstTimeTillDueRatio = function(timeTillDueDate, estTime) {
      var ratio = estTime / timeTillDueDate;
      return ratio;
    };
// This function below returns 'urgency', another parameter used to calculate Rank.  It basically gives higher estimated time to time till due date 'ratio''s an even higher value than it would have otherwise.
    var calculateUrgency = function(ratio) {
      if (ratio >= 0.4) {
        urgency = true;
      } else {
        urgency = false;
      }
      return urgency;
    };
// This function below collects the parameters shown in order to calculate an item's Rank
    var calculateRank = function(importance, ratio, urgency) {
      // if urgency = true, then it helps to create a higher importanceMultiple than otherwise (see beneath)
      if (urgency) {
        urgencyAddend = 2.9;
      } else {
        urgencyAddend = 0;
      }
      // the below calculates the importanceMultiple according to the importance given by the user to the item
      if (importance == "<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i>") {
        importanceMultiple = 3 + urgencyAddend;
      } else if (importance == "<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-half'></i>") {
        importanceMultiple = 2.5 + urgencyAddend;
      } else if (importance == "<i class='fa fa-star'></i><i class='fa fa-star'></i>") {
        importanceMultiple = 2 + urgencyAddend;
      } else if (importance == "<i class='fa fa-star'></i><i class='fa fa-star-half'></i>") {
        importanceMultiple = 1.5 + urgencyAddend;
      } else {
        importanceMultiple = 1.1 + urgencyAddend;
      }
      // The Ranking calculation below prioritizes to do items whose estimated time to completion are larger relative to their time till due dates.  The second influence is the importance factor, however this is not as important unless the item is due soon as well.
      var rank = Math.round((ratio * importanceMultiple + ratio) * 1000000);
      return rank;
    };
// The function below calls all of the public functions related to Rank above in order to return 'rank' and 'urgency'.  This function is called both when an item is newly created and when it is updated.
    var prioritize = function(item, dueDate, importance, newUrgency, eHour, eMinute) {
      var timeTillDueDate = dueDate - now;
      // estTime comes out in milliseconds and does not go into the database, it is used by calculate ratio below
      var estTime = calculateEstTime(eHour, eMinute);
      // ratio does not go into DB, but is used to figure out RANK below (words in all-caps refer to things that DO go into the DB)
      var ratio = calculateTimeEstTimeTillDueRatio(timeTillDueDate, estTime);
      if (item === null) {
        // in case the item is being currently created
        var currentUrgency = calculateUrgency(ratio);
      } else {
        // in case the item already exists and is just being updated
        var currentUrgency = newUrgency;
      }
      var rank = calculateRank(importance, ratio, currentUrgency);
      return {
        urgency: currentUrgency,
        rank: rank
      };
    };

// -- FUNCTIONS CALLED BY CONTROLLER --
    return {
      // handing addOrUpdateDataItems over to UserCtrl.js for data creation and updating
      addOrUpdateDataItems: function(owner, itemDueDate, propArray, valArray) {
        addOrUpdateDataItems(owner, itemDueDate, propArray, valArray);
      },
      // handing ref over to AuthCtrl.js for User creation and authentication.
      getItemsRef: function() {
        return itemsRef;
      },
      // The function below and the one underneath, 'parseTime' are both called by '$scope.parseTime' in UserCtrl to display detailed estimated time to completion info for item in DOM
      calculateTimeTillDueDate: function(dueDate, time) {
        if (typeof dueDate === "object") {
          dueDate = dueDate.getTime();
        }

        timeLeftInMillisecs = dueDate - time;
        return timeLeftInMillisecs;
      },

      parseTime: function(timeInMillisecs) {
        // 'time' has to be in milliseconds
        // var millisecsInYear = 12 * 30.4166 * 24 * 60 * 60 * 1000;
        var millisecsInYear = 31535930880;
        // var millisecsInMonth = 30.4166 * 24 * 60 * 60 * 1000;
        var millisecsInMonth = 2627994239.9999995;
        // var millisecsInDay = 24 * 60 * 60 * 1000;
        var millisecsInDay = 86400000;
        // var millisecsInHour = 60 * 60 * 1000;
        var millisecsInHour = 3600000;
        // var millisecsInMinute = 60 * 1000;
        var millisecsInMinute = 60000;
        var millisecsInSecs = 1000;

        if (timeInMillisecs < 0) {
          var years = Math.abs(timeInMillisecs / millisecsInYear);
          var lessThanYear = Math.abs(timeInMillisecs % millisecsInYear);
          var months = Math.abs(lessThanYear / millisecsInMonth);
          var lessThanMonth = Math.abs(lessThanYear % millisecsInMonth);
          var days = Math.abs(lessThanMonth / millisecsInDay);
          var lessThanDay = Math.abs(lessThanMonth % millisecsInDay);
          var hours = Math.abs(lessThanDay / millisecsInHour);
          var lessThanHour = Math.abs(lessThanDay % millisecsInHour);
          var minutes = Math.abs(lessThanHour / millisecsInMinute);
          var lessThanMinute = Math.abs(lessThanHour % millisecsInMinute);
          var seconds = Math.abs(Math.round(lessThanMinute / millisecsInSecs));
        } else {
          var years = timeInMillisecs / millisecsInYear;
          var lessThanYear = timeInMillisecs % millisecsInYear;
          var months = lessThanYear / millisecsInMonth;
          var lessThanMonth = lessThanYear % millisecsInMonth;
          var days = lessThanMonth / millisecsInDay;
          var lessThanDay = lessThanMonth % millisecsInDay;
          var hours = lessThanDay / millisecsInHour;
          var lessThanHour = lessThanDay % millisecsInHour;
          var minutes = lessThanHour / millisecsInMinute;
          var lessThanMinute = lessThanHour % millisecsInMinute;
          var seconds = Math.round(lessThanMinute / millisecsInSecs);
        }

        return {
          total: timeInMillisecs,
          year: Math.floor(years),
          month: Math.floor(months),
          day: Math.floor(days),
          hour: Math.floor(hours),
          minute: Math.floor(minutes),
          second: seconds
        };
      },
// This function is called by the submit button in userincompleteItems.html when user creates an item in the form
      addItem: function(itemName, dueDate, importance, eHour, eMinute) {

        // console.log(itemName + ": begin");

        // empty the below variables in order to contextualize the 'prioritize' call for the 'addItem' function
        var item = null;
        var urgency = null;

        var dueDate = dueDate.getTime();

        var itemProperties = prioritize(item, dueDate, importance, urgency, eHour, eMinute);
        var owner = "addItem";

        var propArray = ["itemLeftCount", "hoursLeft", "minutesLeft"];
        var valArray = [1, eHour, eMinute];

        addOrUpdateDataItems(owner, dueDate, propArray, valArray);

        items.$add({
          name: itemName,
          // dueDate: dueDate.getTime(),
          dueDate: dueDate,
          eHour: eHour,
          eMinute: eMinute,
          importance: importance,
          isSafeToComplete: false,
          isComplete: false,
          isPastDue: false,
          isUrgent: itemProperties.urgency,
          rank: itemProperties.rank,
          created_at: firebase.database.ServerValue.TIMESTAMP,
          completed_at: 0
        }).then(function(itemsRef) {
          var id = itemsRef.key;
          // console.log(itemName + ": end.  Added item with id " + id);
          items.$indexFor(id);

        });
      }, // end of AddItem
// This function is called by UserCtrl '$scope.showComplex' function, which is in turn called by 'userincompleteItems.html' when the user clicks on the 'edit' button for a given item.  The $scope.showComplex' function creates a modal that offers update options to the user.  Clicking close on the modal resolves '$scope.updateItem' which calls 'updateItem' below
      updateItem: function(oldItem, newName, newDueDate, newImportance, newUrgent, newHours, newMinutes) {
        // console.log("updateItem called");

        if (typeof newDueDate == "object") {
          var newDueDate = newDueDate.getTime();
        }
        var hourDiff = newHours - oldItem.eHour;
        var minuteDiff = newMinutes - oldItem.eMinute;
        var hourPastDiff = newHours - (oldItem.eHour * 2);
        var minutePastDiff = newMinutes - (oldItem.eMinute * 2);
        var hourNeg = oldItem.eHour * -1;
        var minuteNeg = oldItem.eMinute * -1;

        var oldDueDate = oldItem.dueDate;
        var beginDay = findMoment(oldDueDate).firstNum;
        var endDay = findMoment(oldDueDate).lastNum;

        var owner = "updateItem";

        if (oldItem.isComplete) {

          updateCompletion(oldItem, newDueDate, newhours, newMinutes);

        } else if (!(oldItem.isComplete) && newDueDate >= beginDay && newDueDate <= endDay) { // This condition is met if the user's date update is less than 24 hours different from old date

          if (!(oldItem.isPastDue) && newDueDate > now) {
            console.log("updateItem: same date condition 1 was met");

            var propArray = ["itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray = [0, hourDiff, minuteDiff];

          } else if (!(oldItem.isPastDue) && newDueDate < now) {
            console.log("updateItem: same date condition 2 was met");
            var propArray = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray = [0, hourPastDiff, minutePastDiff, 0, hourDiff, minuteDiff];

            // Just in case updateAllItemsPastDue and updateItem cannot save data into same dataItem:

            // var propArray = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount", "hoursLeft", "minutesLeft"];
            // var valArray = [1, newHours, newMinutes, 0, hourDiff, minuteDiff];

          } else if (oldItem.isPastDue && newDueDate > now) {
            console.log("updateItem: same date condition 3 was met");
            var propArray = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount",  "hoursLeft", "minutesLeft"];
            var valArray = [0, oldItem.eHour, oldItem.eMinute, 0, hourDiff, minuteDiff];

            // Just in case updateAllItemsPastDue and updateItem cannot save data into same dataItem:

            // var propArray = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount",  "hoursLeft", "minutesLeft"];
            // var valArray = [-1, hourNeg, minuteNeg, 0, hourDiff, minuteDiff];


          } else if (oldItem.isPastDue && newDueDate < now) {
            console.log("updateItem: same date condition 4 was met");
            var propArray = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray = [0, hourDiff, minuteDiff, 0, hourDiff, minuteDiff];

          }

          addOrUpdateDataItems(owner, oldDueDate, propArray, valArray);

        } else if (!(oldItem.isComplete)) { // This condition is met if user's date update is larger than 24 hours

          if (!(oldItem.isPastDue) && newDueDate > now) {
            console.log("updateItem: diff date condition 1 was met");
            var propArray1 = ["itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray1 = [-1, hourNeg, minuteNeg];

            var propArray2 = ["itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray2 = [1, newHours, newMinutes];

          } else if (!(oldItem.isPastDue) && newDueDate < now) {
            console.log("updateItem: diff date condition 2 was met");

            var propArray1 = ["itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray1 = [-1, hourNeg, minuteNeg];

            var propArray2 = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray2 = [0, hourPastDiff, minutePastDiff, 1, newHours, newMinutes];

            // Just in case updateAllItemsPastDue and updateItem cannot save data into same dataItem:

            // var propArray1 = ["itemLeftCount", "hoursLeft", "minutesLeft"];
            // var valArray1 = [-1, hourNeg, minuteNeg];
            //
            // var propArray2 = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount", "hoursLeft", "minutesLeft"];
            // var valArray2 = [1, newHours, newMinutes, 1, newHours, newMinutes];

          } else if (oldItem.isPastDue && newDueDate > now) {
            console.log("updateItem: diff date condition 3 was met");

            var propArray1 = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount",  "hoursLeft", "minutesLeft"];
            var valArray1 = [-1, hourNeg, minuteNeg, -1, hourNeg, minuteNeg];

            var propArray2 = ["itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray2 = [1, newHours, newMinutes];

            // Just in case updateAllItemsPastDue and updateItem cannot save data into same dataItem:

            // var propArray1 = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount",  "hoursLeft", "minutesLeft"];
            // var valArray1 = [-1, hourNeg, minuteNeg, -1, hourNeg, minuteNeg];
            //
            // var propArray2 = ["itemLeftCount", "hoursLeft", "minutesLeft"];
            // var valArray2 = [1, newHours, newMinutes];

          } else if (oldItem.isPastDue && newDueDate < now) {
            console.log("updateItem: diff date condition 4 was met");

            var propArray1 = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount",  "hoursLeft", "minutesLeft"];
            var valArray1 = [-1, hourNeg, minuteNeg, -1, hourNeg, minuteNeg];

            var propArray2 = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray2 = [1, newHours, newMinutes, 1, newHours, newMinutes];

            // Just in case updateAllItemsPastDue and updateItem cannot save data into same dataItem:

            // var propArray1 = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount",  "hoursLeft", "minutesLeft"];
            // var valArray1 = [-1, hourNeg, minuteNeg, -1, hourNeg, minuteNeg];
            //
            // var propArray2 = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount", "hoursLeft", "minutesLeft"];
            // var valArray2 = [1, newHours, newMinutes, 1, newHours, newMinutes];

          }

          addOrUpdateDataItems(owner, oldDueDate, propArray1, valArray1);
          addOrUpdateDataItems(owner, newDueDate, propArray2, valArray2);

        } // end of conditional

        var updatedItemProperties = prioritize(oldItem, newDueDate, newImportance, newUrgent, newHours, newMinutes);

        // var t = new Date();
        // console.log("step 5 - ItemCrud.updateItem old name: " + oldItem.name + " and name: " + newName + " and item date " + newDueDate + ". Time: " + t.getMinutes() + ":" + t.getSeconds() + ":" + t.getMilliseconds());

        oldItem.name = newName;
        oldItem.dueDate = newDueDate;
        oldItem.importance = newImportance;
        oldItem.isUrgent = updatedItemProperties.urgency;
        oldItem.eHour = newHours;
        oldItem.eMinute = newMinutes;
        oldItem.rank = updatedItemProperties.rank;

        items.$save(oldItem).then(function(itemsRef) {
          // console.log("items.$save called");
        });

      },
// called by UserCtrl in order to populate items and dataItems in DOM via $scope
      getAllItems: function() {
        return items;
      },

      getDataItems: function() {
        return dataItems;
      },

// The function below is the actual deletion process for items.  The user has the power to only mark items as complete.  Complete or Past Due (i.e. incomplete but not marked as complete after the due date) items are rescuable and able to be set as incomplete for up to a week.  After one week, all Complete and Past Due items are deleted when this function is called by UserCtrl function 'refreshTalliesAndData', which is called when (1) 'userincompleteItems.html' is initialized, and when either (2) '$scope.updateItems', or (3) '$scope.addItem', or (4) '$scope.updateCompletion' are called.
      processOldCompleteItems: function () {
        var totalItems = items.length;

        for (var i = 0; i < totalItems; i++) {
          if (items[i].isComplete && items[i].dueDate + week < now) {

            var itemToDelete = items.$getRecord(items[i].$id);

            // 'date' is part of the console.log
            var date = new Date(itemToDelete.dueDate);
            var dueDate = itemToDelete.dueDate;
            var owner = "processOldCompleteItems";

            console.log("item named " + itemToDelete.name + " with date: " + date.toString() + ", is about to be removed");

            var hourNeg = items[i].eHour * -1;
            var minuteNeg = items[i].eMinute * -1;

            if (!(items[i].isPastDue)) {

              var propArray = ["itemWorkedCount", "hoursWorked", "minutesWorked"];
              var valArray = [-1, hourNeg, minuteNeg];

            } else if (items[i].isPastDue) {

              var propArray = ["itemWorkedCount", "hoursWorked", "minutesWorked", "itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete"];
              var valArray = [-1, hourNeg, minuteNeg, -1, hourNeg, minuteNeg];

            }

            addOrUpdateDataItems(owner, dueDate, propArray, valArray);

            items.$remove(itemToDelete).then(function() {
                console.log("item, which is now " + itemToDelete + ", has been removed");
              });
            // Still figuring out how to $destroy items and avoid memory leaks.
            // items.$destroy(items[i]);
          }
        }
      },
// The function below updates items that are past due (i.e. incomplete but not marked as complete after the due date) with pastDue = true.  It also tallies these items.  It is called by UserCtrl function '$scope.refreshTalliesAndData'
      updateAllItemsPastDue: function() {
        var totalItems = items.length;
        var owner = "updateAllItemsPastDue";

        for (var i = 0; i < totalItems; i++) {

          var dueDate = items[i].dueDate;

          if (!items[i].isComplete && items.$loaded()) { // items.$loaded() doesn't seem necessary

            var propArray = ["itemOverdueCount", "hoursOverdue", "minutesOverdue"];

            if ((items[i].dueDate < now) && !(items[i].isPastDue)) {
              items[i].isPastDue = true;
              items.$save(items[i]);

              var valArray = [1, items[i].eHour, items[i].eMinute];

              addOrUpdateDataItems(owner, dueDate, propArray, valArray);

            } else if ((items[i].dueDate > now) && (items[i].isPastDue)) {
              items[i].isPastDue = false;
              items.$save(items[i]);

              var hourNeg = items[i].eHour * -1;
              var minuteNeg = items[i].eMinute * -1;
              var valArray = [-1, hourNeg, minuteNeg];

              addOrUpdateDataItems(owner, dueDate, propArray, valArray);
            }
          }
        }
      },

      toggleItemToDelete: function(item) {
        var queriedItem = items.$getRecord(item.$id);

        if (queriedItem.isSafeToComplete === false) {
          item.isSafeToComplete = true;
        } else if (queriedItem.isSafeToComplete === true){
          item.isSafeToComplete = false;
        }

        items.$save(queriedItem);
      },

      toggleSelectForDelete: function(items) {
        for (var i = 0; i < items.length; i++) {
          if (!items[i].isSafeToComplete && !items[i].isComplete) {
            items[i].isSafeToComplete = true;
          } else if (items[i].isSafeToComplete && !items[i].isComplete) {
            items[i].isSafeToComplete = false;
          }
          items.$save(items[i]);
        }
      },

// The function below marks item as complete or incomplete depending on its original state.  It is called by 'userincompleteItems.html' by the delete button and by 'userCompleteItems.html' by the modal.
      updateCompletion: function(item, newDueDate, newhours, newMinutes) {
        // Remember: The IF condition below can only be executed by the deleteBtn in userincompleteItems.html, which effectively delets the item from to do and relegates it to the archive.
        // The ELSE IF condition can be executed by BOTH the un-delete button in archive and the Modal when this latter is executed from archive.
        var item = items.$getRecord(item.$id);

        if (typeof newDueDate === "undefined") {
          var newDueDate = 0;
        }

        var hourDiff = newHours - item.eHour;
        var minuteDiff = newMinutes - item.eMinute;
        var hourPastDiff = newHours - (item.eHour * 2);
        var minutePastDiff = newMinutes - (item.eMinute * 2);
        var hourNeg = item.eHour * -1;
        var minuteNeg = item.eMinute * -1;
        var oldDueDate = item.dueDate;

        var beginDay = findMoment(oldDueDate).firstNum;
        var endDay = findMoment(oldDueDate).lastNum;

        var owner = "updateCompletion";

        if (!item.isComplete) {
          item.isComplete = true;
          item.completed_at = firebase.database.ServerValue.TIMESTAMP;

          if (!(item.isPastDue)) {

            var propArray = ["itemLeftCount", "hoursLeft", "minutesLeft", "itemWorkedCount", "hoursWorked", "minutesWorked"];
            var valArray = [-1, hourNeg, minuteNeg, 1, item.eHour, item.eMinute];

          } else if (item.isPastDue) {

            var propArray = ["itemLeftCount", "hoursLeft", "minutesLeft", "itemWorkedCount", "hoursWorked", "minutesWorked", "itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete"];

            var valArray = [-1, hourNeg, minuteNeg, 1, item.eHour, item.eMinute, -1, hourNeg, minuteNeg, 1, item.eHour, item.eMinute];
          }

          addOrUpdateDataItems(owner, oldDueDate, propArray, valArray);

        } else if (item.isComplete) {
          item.isComplete = false;
          item.completed_at = 0;
          item.isSafeToComplete = false;
          // undeleting item, changing its dataItems props


          if (newDueDate == 0 || (newDueDate >= beginDay && newDueDate <= endDay)) {

            if (!(item.isPastDue) && newDueDate > now) {

              var propArray = ["itemWorkedCount", "hoursWorked", "minutesWorked", "itemLeftCount", "hoursLeft", "minutesLeft"];
              var valArray = [-1, hourNeg, minuteNeg, 1, item.eHour, item.eMinute];

            } else if (!(item.isPastDue) && newDueDate < now) {

              var propArray = ["itemWorkedCount", "hoursWorked", "minutesWorked", "itemLeftCount", "hoursLeft", "minutesLeft"];
              var valArray = [-1, hourNeg, minuteNeg, 1, item.eHour, item.eMinute];

              // Just in case updateAllItemsPastDue and updateItem cannot save data into same dataItem:

              // var propArray = ["itemWorkedCount", "hoursWorked", "minutesWorked", "itemLeftCount", "hoursLeft", "minutesLeft", "itemOverdueCount", "hoursOverdue", "minutesOverdue"];
              // var valArray = [-1, hourNeg, minuteNeg, 1, item.eHour, item.eMinute, 1, item.eHour, item.eMinute];

            } else if (item.isPastDue && newDueDate > now) {

              var propArray = ["itemWorkedCount", "hoursWorked", "minutesWorked", "itemLeftCount", "hoursLeft", "minutesLeft", "itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete"];

              var valArray = [-1, hourNeg, minuteNeg, 1, item.eHour, item.eMinute, -1, hourNeg, minuteNeg];

            } else if (item.isPastDue && newDueDate < now) {

              var propArray = ["itemWorkedCount", "hoursWorked", "minutesWorked", "itemLeftCount", "hoursLeft", "minutesLeft", "itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete"];

              var valArray = [-1, hourNeg, minuteNeg, 1, item.eHour, item.eMinute, -1, hourNeg, minuteNeg];
            }

            addOrUpdateDataItems(owner, oldDueDate, propArray, valArray);

          } else {

            if (!(oldItem.isPastDue) && newDueDate > now) {

              var propArray1 = ["itemWorkedCount", "hoursWorked", "minutesWorked"];
              var valArray1 = [-1, hourNeg, minuteNeg];

              var propArray2 = ["itemLeftCount", "hoursLeft", "minutesLeft"];
              var valArray2 = [1, item.eHour, item.eMinute];

            } else if (!(oldItem.isPastDue) && newDueDate < now) {

              var propArray1 = ["itemWorkedCount", "hoursWorked", "minutesWorked"];
              var valArray1 = [-1, hourNeg, minuteNeg, 1];

              var propArray2 = ["itemLeftCount", "hoursLeft", "minutesLeft"];
              var valArray2 = [1, item.eHour, item.eMinute];

            } else if (oldItem.isPastDue && newDueDate > now) {

              var propArray1 = ["itemWorkedCount", "hoursWorked", "minutesWorked", "itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete"];
              var valArray1 = [-1, hourNeg, minuteNeg, -1, hourNeg, minuteNeg];

              var propArray2 = ["itemLeftCount", "hoursLeft", "minutesLeft", "itemOverdueCount", "hoursOverdue", "minutesOverdue"];
              var valArray2 = [1, item.eHour, item.eMinute, 1, item.eHour, item.eMinute];

            } else if (oldItem.isPastDue && newDueDate < now) {

              var propArray1 = ["itemWorkedCount", "hoursWorked", "minutesWorked", "itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete"];

              var valArray1 = [-1, hourNeg, minuteNeg, -1, hourNeg, minuteNeg];

              var propArray2 = ["itemLeftCount", "hoursLeft", "minutesLeft"];

              var valArray2 = [1, item.eHour, item.eMinute];

            }

            addOrUpdateDataItems(owner, oldDueDate, propArray1, valArray1);
            addOrUpdateDataItems(owner, newDueDate, propArray2, valArray2);

          }
        }

        items.$save(item);
      }

    }; // end of Return

  } // end of ItemCrud function
]); // end of factory initialization
