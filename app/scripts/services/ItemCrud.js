listo.factory("ItemCrud", ["$firebaseArray", "FirebaseRef", "UserCrud",
  function($firebaseArray, FirebaseRef, UserCrud, DataCrud) {

// Public variables below
    // holds data as array of objects.  Each object is one item.
    var itemsRef = FirebaseRef.getItemsRef();
    var items = FirebaseRef.getItems();


    var now = new Date();
    var nowNum = now.getTime();
    var week = 604800000;

/////// DataCrud variables and functions (note: I cannot relegate it to its own service because I get a recurring $injector:unpr Unknown Provider error despite the fact that DataCrud is injected into ItemCrud and UserCtrl and its file has been scripted into index.html)



// Public variables below
    var dataItemsRef = FirebaseRef.getDataItemsRef();
    var dataItems = FirebaseRef.getDataItems();
    var dataWeekAgoRef = FirebaseRef.getDataWeekAgoRef();
    var dataWeekAgo = FirebaseRef.getDataWeekAgo();
    var dataNextWeekRef = FirebaseRef.getDataNextWeekRef();
    var dataNextWeek = FirebaseRef.getDataNextWeek();

// Public functions below.

// if dataItems array is created for a specific day, 'addOrUpdateDataItems' updates it, otherwise it creates a new one.

    var updateWeeklyData = function(whichWeek, a_start, aa_end, beginWeek, endWeek, prop1, prop2, prop3, value1, value2, value3) {

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

      whichWeek.$save();
    };

    var sortDataIntoWeek = function(itemDueDate, prop1, prop2, prop3, value1, value2, value3) {

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
        return console.log("ITEM DATE is too far into the future");
      } else if (itemDueDate < firstMomentPastWeekNum) {
        return console.log("ITEM DATE is too far into the past");
      } else {
        if (itemDueDate >= firstMomentPastWeekNum && itemDueDate < lastMomentPastWeekNum) {
          var whichWeek = dataWeekAgo;
          var a_start = firstMomentPastWeekString;
          var aa_end = lastMomentPastWeekString;
          var beginWeek = firstMomentPastWeekNum;
          var endWeek = lastMomentPastWeekNum;
        } else if (itemDueDate >= firstMomentNextWeekNum && itemDueDate < lastMomentNextWeekNum) {
          var whichWeek = dataNextWeek;
          var a_start = firstMomentNextWeekString;
          var aa_end = lastMomentNextWeekString;
          var beginWeek = firstMomentNextWeekNum;
          var endWeek = lastMomentNextWeekNum;
        }
        updateWeeklyData(whichWeek, a_start, aa_end, beginWeek, endWeek, prop1, prop2, prop3, value1, value2, value3);
      }
    }; // end sortDataIntoWeek

    var updateDataItems = function(itemDueDate, selectedDataItem, prop1, prop2, prop3, value1, value2, value3) {

      sortDataIntoWeek(itemDueDate, prop1, prop2, prop3, value1, value2, value3);

      // console.log("typeof selectedDataItem is: " + typeof selectedDataItem);

      console.log(owner + " called at " + nowNum + ", dataItems[i] with ID of " + selectedDataItem.$id + " was found");

      if (!(typeof selectedDataItem === "undefined")) {
        selectedDataItem[prop1] += value1;
        selectedDataItem[prop2] += value2;
        selectedDataItem[prop3] += value3;

        // dataItems.$save(selectedDataItem);
        dataItems.$save(selectedDataItem).then(function(selectedDataItem) {

        });

      }

    };

    var createNewDataItems = function(itemDueDate, prop1, prop2, prop3, value1, value2, value3) {

      sortDataIntoWeek(itemDueDate, prop1, prop2, prop3, value1, value2, value3);

      var matchProp = function(propName) {

        if (propName === prop1) {
          return value1;
        } else if (propName === prop2) {
          return value2;
        } else if (propName === prop3) {
          return value3;
        } else {
          return 0;
        }
      };
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

      var itemLeftCount = matchProp("itemLeftCount");
      var itemWorkedCount = matchProp("itemWorkedCount");
      var itemOverdueCount = matchProp("itemOverdueCount");
      var itemDueCompleteCount = matchProp("itemDueCompleteCount");

      dataItems.$add({
        a_start: firstMomentString,
        aa_end: lastMomentString,
        beginDay: firstMomentNum,
        endDay: lastMomentNum,
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
        totalItems: itemLeftCount + itemWorkedCount + itemOverdueCount + itemDueCompleteCount
      });
    };

    addOrUpdateDataItems = function(owner, itemDueDate, prop1, prop2, prop3, value1, value2, value3) {

      if (!(typeof dataItems[0] === "undefined")) {

        for (i = 0; i < dataItems.length; i++) {

          var endDay = dataItems[i].endDay;
          var beginDay = dataItems[i].beginDay;

          if (itemDueDate >= beginDay && itemDueDate <= endDay) {
            updateDataItems(owner, itemDueDate, dataItems[i], prop1, prop2, prop3, value1, value2, value3);
          } else {
            createNewDataItems(itemDueDate, prop1, prop2, prop3, value1, value2, value3);
          }

        }
      } else {
        createNewDataItems(itemDueDate, prop1, prop2, prop3, value1, value2, value3);
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
      addOrUpdateDataItems: function(owner, itemDueDate, prop1, prop2, prop3, value1, value2, value3) {
        addOrUpdateDataItems(owner, itemDueDate, prop1, prop2, prop3, value1, value2, value3);
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

        addOrUpdateDataItems(owner, dueDate, "itemLeftCount", "hoursLeft", "minutesLeft", 1, eHour, eMinute);

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
        var hourNeg = oldItem.eHour * -1;
        var minuteNeg = oldItem.eMinute * -1;

        var owner = "updateItem";

        if (oldItem.isComplete) {

          updateCompletion(oldItem, newDueDate);

        } else {

          /// The addOrUpdateDataItems functions below always create new dataItems, they never fill

          addOrUpdateDataItems(owner, oldDueDate, "itemLeftCount", "hoursLeft", "minutesLeft", -1, hourNeg, minuteNeg);
          console.log("1 - oldDueDate, negating item, hours and minutes left");

          addOrUpdateDataItems(owner, newDueDate, "itemLeftCount", "hoursLeft", "minutesLeft", 1, newHours, newMinutes);
          console.log("2 - newDueDate, adding item, hours and minutes left");

          if (oldItem.isPastDue) {
            addOrUpdateDataItems(owner, oldDueDate, "itemOverdueCount", "hoursOverdue", "minutesOverdue", -1, hourNeg, minuteNeg);
            console.log("3 - oldDueDate, negating item, hours and minutes overdue");

            addOrUpdateDataItems(owner, newDueDate, "itemOverdueCount", "hoursOverdue", "minutesOverdue", 1, newHours, newMinutes);
            console.log("4 - newDueDate, adding item, hours and minutes overdue");
          }
        }

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

            addOrUpdateDataItems(owner, dueDate, "itemWorkedCount", "hoursWorked", "minutesWorked", -1, hourNeg, minuteNeg);

            if (items[i].isPastDue) {
              addOrUpdateDataItems(owner, dueDate, "itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete", -1, hourNeg, minuteNeg);
            }

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
            if (items[i].dueDate < now && !items[i].isPastDue) {
              items[i].isPastDue = true;
              items.$save(items[i]);

              // item becomes overDue, its dataItems props signal this change


              addOrUpdateDataItems(owner, dueDate, "itemOverdueCount", "hoursOverdue", "minutesOverdue", 1, items[i].eHour, items[i].eMinute);

            } else if (items[i].dueDate > now && items[i].isPastDue) {
              items[i].isPastDue = false;
              items.$save(items[i]);

              // item becomes NOT overDue, its dataItems props signal this change
              var hourNeg = items[i].eHour * -1;
              var minuteNeg = items[i].eMinute * -1;
              addOrUpdateDataItems(owner, dueDate, "itemOverdueCount", "hoursOverdue", "minutesOverdue", -1, hourNeg, minuteNeg);
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

          // deleting item, changing its dataItems props

          addOrUpdateDataItems(owner, oldDueDate, "itemLeftCount", "hoursLeft", "minutesLeft", -1, hourNeg, minuteNeg);
          addOrUpdateDataItems(owner, oldDueDate, "itemWorkedCount", "hoursWorked", "minutesWorked", 1, item.eHour, item.eMinute);

          if (item.isPastDue) {
          // deleting item that was pastDue, changing its dataItems props
            addOrUpdateDataItems(owner, oldDueDate, "itemOverdueCount", "hoursOverdue", "minutesOverdue", -1, hourNeg, minuteNeg);

            addOrUpdateDataItems(owner, oldDueDate, "itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete", 1, item.eHour, item.eMinute);
          }
        } else {
          item.isComplete = false;
          item.completed_at = 0;
          item.isSafeToComplete = false;
          // undeleting item, changing its dataItems props
          addOrUpdateDataItems(owner, oldDueDate, "itemWorkedCount", "hoursWorked", "minutesWorked", -1, hourNeg, minuteNeg);
          addOrUpdateDataItems(newDueDate, "itemLeftCount", "hoursLeft", "minutesLeft", 1, item.eHour, item.eMinute);

          if (item.isPastDue) {

            addOrUpdateDataItems(owner, oldDueDate, "itemOverdueCount", "hoursOverdue", "minutesOverdue", -1, hourNeg, minuteNeg);

            addOrUpdateDataItems(owner, newDueDate, "itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete", 1, item.eHour, item.eMinute);
          }
        }
        items.$save(item);
      }

    }; // end of Return

  } // end of ItemCrud function
]); // end of factory initialization
