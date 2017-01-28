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

    var updateWeeklyData = function(whichWeek, a_start, aa_end, beginWeek, endWeek, propValueObject) {

      whichWeek["a_start"] = a_start;
      whichWeek["aa_end"] = aa_end;
      whichWeek["beginWeek"] = beginWeek;
      whichWeek["endWeek"] = endWeek;

      if (whichWeek[prop1] === undefined) {
        whichWeek[prop1] = value1;
      } else {
        whichWeek[prop1] += value1;
      }

      if (whichWeek[prop2] === undefined) {
        whichWeek[prop2] = value2;
      } else {
        whichWeek[prop2] += value2;
      }

      if (whichWeek[prop3] === undefined) {
        whichWeek[prop3] = value3;
      } else {
        whichWeek[prop3] += value3;
      }

      if (whichWeek[prop4] === undefined) {
        whichWeek[prop4] = value4;
      } else {
        whichWeek[prop4] += value4;
      }

      if (whichWeek[prop5] === undefined) {
        whichWeek[prop5] = value5;
      } else {
        whichWeek[prop5] += value5;
      }

      if (whichWeek[prop6] === undefined) {
        whichWeek[prop6] = value6;
      } else {
        whichWeek[prop6] += value6;
      }

      if (whichWeek[prop7] === undefined) {
        whichWeek[prop7] = value7;
      } else {
        whichWeek[prop7] += value7;
      }

      if (whichWeek[prop8] === undefined) {
        whichWeek[prop8] = value8;
      } else {
        whichWeek[prop8] += value8;
      }

      if (whichWeek[prop9] === undefined) {
        whichWeek[prop9] = value9;
      } else {
        whichWeek[prop9] += value9;
      }

      if (whichWeek[prop10] === undefined) {
        whichWeek[prop10] = value10;
      } else {
        whichWeek[prop10] += value10;
      }

      if (whichWeek[prop11] === undefined) {
        whichWeek[prop11] = value11;
      } else {
        whichWeek[prop11] += value11;
      }

      if (whichWeek[prop12] === undefined) {
        whichWeek[prop12] = value12;
      } else {
        whichWeek[prop12] += value12;
      }

      whichWeek.$save();
    };

    var sortDataIntoWeek = function(itemDueDate, propValueObject) {

      var minuteNow = now.getMinutes();
      var hourNow = now.getHours();
      var year = now.getFullYear();
      var month = now.getMonth();
      var dateToday = now.getDate();

      var minuteBeforeNow = function() {
        var minuteBeforeNow = minuteNow - 1;
        if (minuteBeforeNow == 59) {
          var hourBeforeNow = hourNow - 1;
          var minuteBeforeNow = now.setHours(hourBeforeNow);
          return {
            num: minuteBeforeNow,
            obj: new Date(minuteBeforeNow)
          };
        } else {
          var minuteBeforeNow = now.setMinutes(minuteBeforeNow);
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
          var minuteAfterNow = now.setHours(hourAfterNow);
          return {
            num: minuteAfterNow,
            obj: new Date(minuteAfterNow)
          };
        } else {
          var minuteAfterNow = now.setMinutes(minuteAfterNow);
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
        console.log("ITEM DATE is too far into the future");
      } else if (itemDueDate < firstMomentPastWeekNum) {
        console.log("ITEM DATE is too far into the past");
      } else if (itemDueDate >= firstMomentPastWeekNum && itemDueDate < lastMomentPastWeekNum) {
        console.log("IF (dataWeekAgo) condition was called");
        var whichWeek = dataWeekAgo;
        var a_start = firstMomentPastWeekString;
        var aa_end = lastMomentPastWeekString;
        var beginWeek = firstMomentPastWeekNum;
        var endWeek = lastMomentPastWeekNum;

        updateWeeklyData(whichWeek, a_start, aa_end, beginWeek, endWeek, prop1, prop2, prop3, value1, value2, value3, prop4, prop5, prop6, value4, value5, value6);
      } else if (itemDueDate >= firstMomentNextWeekNum && itemDueDate < lastMomentNextWeekNum) {
        console.log("ELSE (dataNextWeek) condition was called");
        var whichWeek = dataNextWeek;
        var a_start = firstMomentNextWeekString;
        var aa_end = lastMomentNextWeekString;
        var beginWeek = firstMomentNextWeekNum;
        var endWeek = lastMomentNextWeekNum;

        updateWeeklyData(whichWeek, a_start, aa_end, beginWeek, endWeek, propValueObject);
      }
    }; // end sortDataIntoWeek

    var updateDataItems = function(owner, itemDueDate, selectedDataItem, propValueObject) {

      sortDataIntoWeek(itemDueDate, propValueObject);

      var dateObj = new Date (itemDueDate);
      var dayOfMonth = dateObj.getDate();

      // console.log(owner + " called at " + nowNum + ", dataItem with ID of " + selectedDataItem.$id + " was found. Day of month: " + dayOfMonth + ", " + prop1 + ": " + value1 + ", " + prop2 + ": " + value2 + ", " + prop3 + ": " + value3 + ".");

      if (!(typeof selectedDataItem === "undefined")) {
        selectedDataItem[prop1] += value1;
        selectedDataItem[prop2] += value2;
        selectedDataItem[prop3] += value3;

        if (!(typeof prop4 === "undefined") && !(typeof prop5 === "undefined") && !(typeof prop6 === "undefined") && !(typeof value4 === "undefined") && !(typeof value5 === "undefined") && !(typeof value6 === "undefined")) {
          selectedDataItem[prop4] += value4;
          selectedDataItem[prop5] += value5;
          selectedDataItem[prop6] += value6;
        }

        var ilc = selectedDataItem["itemLeftCount"];
        var iwc = selectedDataItem["itemWorkedCount"];

        if (typeof ilc === "undefined" ) {
          ilc = 0;
        }

        if (typeof iwc === "undefined" ) {
          iwc = 0;
        }

        selectedDataItem["totalItems"] = ilc + iwc;

        // dataItems.$save(selectedDataItem);
        dataItems.$save(selectedDataItem).then(function(selectedDataItem) {

        });

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

    var createNewDataItems = function(itemDueDate, propValueObject) {

      sortDataIntoWeek(itemDueDate, propValueObject);

      var matchProp = function(propName) {

        if (propName === prop1) {
          return value1;
        } else if (propName === prop2) {
          return value2;
        } else if (propName === prop3) {
          return value3;
        } else if (propName === prop4) {
          return value4;
        } else if (propName === prop5) {
          return value5;
        } else if (propName === prop6) {
          return value6;
        } else {
          return 0;
        }
      };

      var itemLeftCount = matchProp("itemLeftCount");
      var itemWorkedCount = matchProp("itemWorkedCount");
      var itemOverdueCount = matchProp("itemOverdueCount");
      var itemDueCompleteCount = matchProp("itemDueCompleteCount");

      dataItems.$add({
        a_start: firstString,
        aa_end: lastString,
        beginDay: firstNum,
        endDay: lastNum,
        itemLeftCount: itemLeftCount,
        itemWorkedCount: itemWorkedCount,
        itemOverdueCount: itemOverdueCount,
        itemDueCompleteCount: itemDueCompleteCount,
        hoursLeft: matchProp("hoursLeft"),
        minutesLeft: matchProp("minutesLeft"),
        hoursWorked: matchProp("hoursWorked"),
        minutesWorked: matchProp("minutesWorked"),
        hoursOverdue: matchProp("hoursOverdue"),
        minutesOverdue: matchProp("minutesOverdue"),
        hoursDueComplete: matchProp("hoursDueComplete"),
        minutesDueComplete: matchProp("minutesDueComplete"),
        totalItems: itemLeftCount + itemWorkedCount
      });
    };

    addOrUpdateDataItems = function(owner, itemDueDate, propValueObject) {

      if (!(typeof dataItems[0] === "undefined")) {

        for (i = 0; i < dataItems.length; i++) {

          var endDay = dataItems[i].endDay;
          var beginDay = dataItems[i].beginDay;

          if (itemDueDate >= beginDay && itemDueDate <= endDay) {
            updateDataItems(owner, itemDueDate, dataItems[i], propValueObject);
          } else {
            createNewDataItems(itemDueDate, propValueObject);
          }

        }
      } else {
        createNewDataItems(itemDueDate, propValueObject);
      }

    }; // end addOrUpdateDataItems

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
      addOrUpdateDataItems: function(owner, itemDueDate, propValueObject) {
        addOrUpdateDataItems(owner, itemDueDate, propValueObject);
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

        console.log(itemName + ": begin");

        // empty the below variables in order to contextualize the 'prioritize' call for the 'addItem' function
        var item = null;
        var urgency = null;

        var dueDate = dueDate.getTime();

        var itemProperties = prioritize(item, dueDate, importance, urgency, eHour, eMinute);
        var owner = "addItem";

        var propValueObject = {
          prop1: "itemLeftCount",
          prop2: "hoursLeft",
          prop3: "minutesLeft",
          val1: 1,
          val2: eHour,
          val3: eMinute
        }

        addOrUpdateDataItems(owner, dueDate, propValueObject);

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
          console.log(itemName + ": end.  Added item with id " + id);
          items.$indexFor(id);

        });
      }, // end of AddItem
// This function is called by UserCtrl '$scope.showComplex' function, which is in turn called by 'userincompleteItems.html' when the user clicks on the 'edit' button for a given item.  The $scope.showComplex' function creates a modal that offers update options to the user.  Clicking close on the modal resolves '$scope.updateItem' which calls 'updateItem' below
      updateItem: function(oldItem, newName, newDueDate, newImportance, newUrgent, newHours, newMinutes) {

        if (typeof newDueDate == "object") {
          var newDueDate = newDueDate.getTime();
        }

        var oldDueDate = oldItem.dueDate;
        var oldDueDateObj = new Date(oldDueDate);
        var hourDiff = newHours - oldItem.eHour;
        var minuteDiff = newMinutes - oldItem.eMinute;
        var hourNeg = oldItem.eHour * -1;
        var minuteNeg = oldItem.eMinute * -1;

        var oldDueDate = oldItem.dueDate;
        var beginDay = findMoment(oldDueDate).firstNum;
        var endDay = findMoment(oldDueDate).lastNum;

        var owner = "updateItem";

        if (oldItem.isComplete) {

          updateCompletion(oldItem, newDueDate);

        } else if (!(oldItem.isComplete) && newDueDate >= beginDay && newDueDate <= endDay) {

          if (!(oldItem.isPastDue) && newDueDate > now) {

            var propArray = ["itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray = [0, hourDiff, minuteDiff];

          } else if (!(oldItem.isPastDue) && newDueDate < now) {

            var propArray = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray = [1, newHours, newMinutes, 0, hourDiff, minuteDiff];

          } else if (oldItem.isPastDue && newDueDate > now) {

            var propArray = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount",  "hoursLeft", "minutesLeft"];
            var valArray = [-1, hourNeg, minuteNeg, 0, hourDiff, minuteDiff];

          } else if (oldItem.isPastDue && newDueDate < now) {

            var propArray = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray = [0, hourDiff, minuteDiff, 0, hourDiff, minuteDiff];

          }

          addOrUpdateDataItems(owner, oldDueDate, propArray, valArray);

        } else if (!(oldItem.isComplete)) {

          if (!(oldItem.isPastDue) && newDueDate > now) {

            var propArray1 = ["itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray1 = [-1, hourNeg, minuteNeg];

            var propArray2 = ["itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray2 = [1, newHours, newMinutes];

          } else if (!(oldItem.isPastDue) && newDueDate < now) {

            var propArray1 = ["itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray1 = [-1, hourNeg, minuteNeg];

            var propArray2 = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray2 = [1, newHours, newMinutes, 1, newHours, newMinutes];

          } else if (oldItem.isPastDue && newDueDate > now) {

            var propArray1 = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount",  "hoursLeft", "minutesLeft"];
            var valArray1 = [-1, hourNeg, minuteNeg, -1, hourNeg, minuteNeg];

            var propArray2 = ["itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray2 = [1, newHours, newMinutes];

          } else if (oldItem.isPastDue && newDueDate < now) {

            var propArray1 = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount",  "hoursLeft", "minutesLeft"];
            var valArray1 = [-1, hourNeg, minuteNeg, -1, hourNeg, minuteNeg];

            var propArray2 = ["itemOverdueCount", "hoursOverdue", "minutesOverdue", "itemLeftCount", "hoursLeft", "minutesLeft"];
            var valArray2 = [1, newHours, newMinutes, 1, newHours, newMinutes];

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

          if (!items[i].isComplete) {

            var propArray = ["itemOverdueCount", "hoursOverdue", "minutesOverdue"];

            if (items[i].dueDate < now && !items[i].isPastDue) {
              items[i].isPastDue = true;
              items.$save(items[i]);

              var valArray = [1, items[i].eHour, items[i].eMinute];

            } else if (items[i].dueDate > now && items[i].isPastDue) {
              items[i].isPastDue = false;
              items.$save(items[i]);

              var hourNeg = items[i].eHour * -1;
              var minuteNeg = items[i].eMinute * -1;
              var valArray = [-1, hourNeg, minuteNeg];

            }
            addOrUpdateDataItems(owner, dueDate, propArray, valArray);
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
      updateCompletion: function(item, newDueDate) {
        // Remember: The IF condition below can only be executed by the deleteBtn in userincompleteItems.html, which effectively delets the item from to do and relegates it to the archive.
        // The ELSE IF condition can be executed by BOTH the un-delete button in archive and the Modal when this latter is executed from archive.
        var item = items.$getRecord(item.$id);
        var oldDueDate = item.dueDate;

        var hourNeg = item.eHour * -1;
        var minuteNeg = item.eMinute * -1;
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


          if (!(item.isPastDue)) {

            var beginDay = findMoment(oldDueDate).firstNum;
            var endDay = findMoment(oldDueDate).lastNum;

            if (newDueDate >= beginDay && newDueDate <= endDay) {

              var propArray = ["itemWorkedCount", "hoursWorked", "minutesWorked", "itemLeftCount", "hoursLeft", "minutesLeft"];
              var valArray = [-1, hourNeg, minuteNeg, 1, item.eHour, item.eMinute]];

              addOrUpdateDataItems(owner, oldDueDate, propArray1, valArray);

            } else {
              var propArray1 = ["itemWorkedCount", "hoursWorked", "minutesWorked"];
              var valArray1 = [-1, hourNeg, minuteNeg];

              var propArray2 = ["itemLeftCount", "hoursLeft", "minutesLeft"];
              var valArray2 = [1, item.eHour, item.eMinute];

              addOrUpdateDataItems(owner, oldDueDate, propArray1, valArray1);

              addOrUpdateDataItems(owner, newDueDate, propArray2, valArray2);
            }

          } else if (item.isPastDue) {

            if (newDueDate >= beginDay && newDueDate <= endDay) {

              var propArray1 = ["itemWorkedCount", "hoursWorked", "minutesWorked", "itemLeftCount", "hoursLeft", "minutesLeft", "itemOverdueCount", "hoursOverdue", "minutesOverdue"];
              var valArray1 = [-1, hourNeg, minuteNeg, 1, item.eHour, item.eMinute, -1, hourNeg, minuteNeg];

              var propArray2 = ["itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete"];
              var valArray2 = [1, item.eHour, item.eMinute];

              addOrUpdateDataItems(owner, oldDueDate, propArray, valArray1);


            } else {

              var propArray1 = ["itemWorkedCount", "hoursWorked", "minutesWorked", "itemLeftCount", "hoursLeft", "minutesLeft", "itemOverdueCount", "hoursOverdue", "minutesOverdue"];
              var valArray1 = [-1, hourNeg, minuteNeg, 1, item.eHour, item.eMinute, -1, hourNeg, minuteNeg];

              var propArray2 = ["itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete"];
              var valArray2 = [1, item.eHour, item.eMinute];

              addOrUpdateDataItems(owner, oldDueDate, propArray1, valArray1);

              addOrUpdateDataItems(owner, newDueDate, propArray2, valArray2);

            }

          }
        }

        items.$save(item);
      }

    }; // end of Return

  } // end of ItemCrud function
]); // end of factory initialization
