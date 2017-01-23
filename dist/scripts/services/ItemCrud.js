listo.factory("ItemCrud", ["$firebaseArray", "FirebaseRef", "UserCrud",
  function($firebaseArray, FirebaseRef, UserCrud) {

// holds data as array of objects.  Each object is one item.
    var itemsRef = FirebaseRef.getItemsRef();
    var items = FirebaseRef.getItems();
    var dataItemsRef = FirebaseRef.getDataItemsRef();
    var dataItems = FirebaseRef.getDataItems();

// Public variables below
    var now = Date.now();
    var week = 604800000;

    var dayObj = new Date();
    var year = dayObj.getFullYear();
    var month = dayObj.getMonth();
    var date = dayObj.getDate();
    var firstMomentObj = new Date(year, month, date, 0, 0, 0, 0);
    var firstMomentNum = firstMomentObj.getTime();
    var firstMomentString = firstMomentObj.toString();
    var lastMomentObj = new Date(year, month, date, 23, 59, 59, 999);
    var lastMomentNum = lastMomentObj.getTime();
    var lastMomentString = lastMomentObj.toString();

// Public functions below.

// if dataItems array is created for a specific day, 'addOrUpdateDataItems' updates it, otherwise it creates a new one.
    var addOrUpdateDataItems = function(prop1, prop2, prop3, value1, value2, value3) {

      // if ((typeof dataItems === "undefined") && (typeof dataItems[dataItems.length - 1] === "undefined") && (typeof id === "undefined") && (typeof lastInArray === "undefined") && (typeof lastDataItemsEntry === "undefined")) {

        // This condition can only be met when the above variables != undefined
        // But, if the above variables != undefined, the below variables are undefined and throw an exception.

        var lastInArray = dataItems[dataItems.length - 1];
        var id = lastInArray.$id;
        var lastDataItemsEntry = dataItems.$getRecord(id);
        var lastEndDay = lastDataItemsEntry.endDay;

        console.log("AFTER ALL SETTERS: typeof dataItems is " + typeof dataItems + ", typeof lastDataItemsEntry is " + typeof lastDataItemsEntry + ", typeof lastEndDay is " + typeof lastEndDay);
      // }

      if (!(typeof dataItems === "undefined") && !(typeof dataItems[dataItems.length - 1] === "undefined") && !(typeof id === "undefined") && !(typeof lastDataItemsEntry === "undefined")) {

        if (lastEndDay >= firstMomentNum) {
          updateDataItems(lastDataItemsEntry, prop1, prop2, prop3, value1, value2, value3);
          console.log("SINCE lastEndDay is >= than firstMomentNum, updateDataItems was called");
        } else if (lastEndDay < firstMomentNum) {
          createNewDataItems(firstMomentNum, lastMomentNum, prop1, prop2, prop3, value1, value2, value3);
          console.log("SINCE lastEndDay is < than firstMomentNum, createNewDataItems was called");
        }
      } else {
        createNewDataItems(firstMomentNum, lastMomentNum, prop1, prop2, prop3, value1, value2, value3);
        console.log("SINCE lastDataItemsEntry is undefined,  createNewDataItems was called to create new dataItem")
      }

    };


    var updateDataItems = function(lastDataItemsEntry, prop1, prop2, prop3, value1, value2, value3) {

      console.log("updateDataItems called");
      console.log("is lastDataItemsEntry defined? " + typeof lastDataItemsEntry);

      if (!(typeof lastDataItemsEntry === "undefined") && !(typeof id === "undefined")) {
        console.log("within updateDataItems function, id: " + id + ", lastDataItemsEntry: " + lastDataItemsEntry + ", lastDataItemsEntry.endDay = " + lastDataItemsEntry.endDay);
      }

      if (!(typeof lastDataItemsEntry === "undefined")) {
        lastDataItemsEntry[prop1] += value1;
        lastDataItemsEntry[prop2] += value2;
        lastDataItemsEntry[prop3] += value3;

        // dataItems.$save(lastDataItemsEntry);
        dataItems.$save(lastDataItemsEntry).then(function(lastDataItemsEntry) {
          console.log("saved " + lastDataItemsEntry[prop1] + "as " + value1 + ", " + lastDataItemsEntry[prop2] + "as " + value2 + "and, " + lastDataItemsEntry[prop3] + "as " + value3);
        });

      }

    };

    var createNewDataItems = function(firstMomentNum, lastMomentNum, prop1, prop2, prop3, value1, value2, value3) {

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

    var initiateDataItems = function() {

      // if (typeof dataItems == "undefined") {
        var itemLeftCount = 0;
        var itemWorkedCount = 0;
        var itemOverdueCount = 0;
        var itemDueCompleteCount = 0;
        var hoursLeft = 0;
        var minutesLeft = 0;
        var hoursWorked = 0;
        var minutesWorked = 0;
        var hoursOverdue = 0;
        var minutesOverdue = 0;
        var hoursDueComplete = 0;
        var minutesDueComplete = 0;

        dataItems.$add({
          a_start: firstMomentString,
          aa_end: lastMomentString,
          beginDay: firstMomentNum,
          endDay: lastMomentNum,
          itemLeftCount: itemLeftCount,
          itemWorkedCount: itemWorkedCount,
          itemOverdueCount: itemOverdueCount,
          itemDueCompleteCount: itemDueCompleteCount,
          hoursLeft: hoursLeft,
          minutesLeft: minutesLeft,
          hoursWorked: hoursWorked,
          minutesWorked: minutesWorked,
          hoursOverdue: hoursOverdue,
          minutesOverdue: minutesOverdue,
          hoursDueComplete: hoursDueComplete,
          minutesDueComplete: minutesDueComplete,
          totalItems: itemLeftCount + itemWorkedCount + itemOverdueCount + itemDueCompleteCount
        });
      // } else {
      //   console.log("dataItems is defined, no need to initiate dataItems");
      // }
    };


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

      initiateDataItems: function() {
        initiateDataItems();
      },

      addOrUpdateDataItems: function(prop1, prop2, prop3, value1, value2, value3) {
        addOrUpdateDataItems(prop1, prop2, prop3, value1, value2, value3);
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
        // empty the below variables in order to contextualize the 'prioritize' call for the 'addItem' function
        var item = null;
        var urgency = null;

        var itemProperties = prioritize(item, dueDate, importance, urgency, eHour, eMinute);

        addOrUpdateDataItems("itemLeftCount", "hoursLeft", "minutesLeft", 1, eHour, eMinute);

        items.$add({
          name: itemName,
          dueDate: dueDate.getTime(),
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
          console.log("added item with id " + id);
          items.$indexFor(id);

        });
      }, // end of AddItem
// This function is called by UserCtrl '$scope.showComplex' function, which is in turn called by 'userincompleteItems.html' when the user clicks on the 'edit' button for a given item.  The $scope.showComplex' function creates a modal that offers update options to the user.  Clicking close on the modal resolves '$scope.updateItem' which calls 'updateItem' below
      updateItem: function(oldItem, newName, newDueDate, newImportance, newUrgent, newHours, newMinutes) {

        if (typeof newDueDate == "object") {
          var newDueDate = newDueDate.getTime();
        } else if (typeof newDueDate != "number") {
          console.log("dueDate, " + newDueDate + ", is neither a Date Object nor a number, but a " + typeof newDueDate + ".");
        } else {
          console.log("dueDate is a " + typeof newDueDate + ".");
        }

        var updatedItemProperties = prioritize(oldItem, newDueDate, newImportance, newUrgent, newHours, newMinutes);

        var t = new Date();
        console.log("step 5 - ItemCrud.updateItem old name: " + oldItem.name + " and name: " + newName + " and item date " + newDueDate + ". Time: " + t.getMinutes() + ":" + t.getSeconds() + ":" + t.getMilliseconds());

        oldItem.name = newName;
        oldItem.dueDate = newDueDate;
        oldItem.importance = newImportance;
        oldItem.isUrgent = updatedItemProperties.urgency;
        oldItem.eHour = newHours;
        oldItem.eMinute = newMinutes;
        oldItem.rank = updatedItemProperties.rank;

        items.$save(oldItem).then(function(itemsRef) {
          console.log("items.$save called");
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

            console.log("item named " + itemToDelete.name + " with date: " + date.toString() + ", is about to be removed");

            // itemToDelete = null;


            // erasing item, so subtracting its properties from itemWorkedCount, hoursWorked, minutesWorked

            var hourDiff = items[i].eHour * -1;
            var minuteDiff = items[i].eMinute * -1;

            addOrUpdateDataItems("itemWorkedCount", "hoursWorked", "minutesWorked", -1, hourDiff, minuteDiff);

            // alternative addOrUpdateDataItems code:
            // var propArray = ["itemWorkedCount", "hoursWorked", "minutesWorked"];
            // var valArray = [-1, hourDiff, minuteDiff];
            //
            // addOrUpdateDataItems(propArray, valArray);

            if (items[i].isPastDue) {
              // if item was past due, then erasing it erases its dueComplete dataItems props
              addOrUpdateDataItems("itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete", -1, hourDiff, minuteDiff);

              // alternative addOrUpdateDataItems code:
              // var propArray = ["itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete"];
              // addOrUpdateDataItems(propArray, valArray);
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

        for (var i = 0; i < totalItems; i++) {
          if (!items[i].isComplete) {
            if (items[i].dueDate < now && !items[i].isPastDue) {
              items[i].isPastDue = true;
              items.$save(items[i]);

              // item becomes overDue, its dataItems props signal this change
              addOrUpdateDataItems("itemOverdueCount", "hoursOverdue", "minutesOverdue", 1, items[i].eHour, items[i].eMinute);

              // alternative addOrUpdateDataItems code:
              // var propArray = ["itemOverdueCount", "hoursOverdue", "minutesOverdue"];
              // var valArray = [1, items[i].eHour, items[i].eMinute];
              //
              // addOrUpdateDataItems(propArray, valArray);

            } else if (items[i].dueDate > now && items[i].isPastDue) {
              items[i].isPastDue = false;
              items.$save(items[i]);

              // item becomes NOT overDue, its dataItems props signal this change
              var hourDiff = items[i].eHour * -1;
              var minuteDiff = items[i].eMinute * -1;
              addOrUpdateDataItems("itemOverdueCount", "hoursOverdue", "minutesOverdue", -1, hourDiff, minuteDiff);

              // alternative addOrUpdateDataItems code:
              // var valArray = [-1, hourDiff, minuteDiff];
              // addOrUpdateDataItems(propArray, valArray);
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

        console.log("is Safe to complete? " + item.isSafeToComplete);
      },

      toggleSelectForDelete: function(items) {
        for (var i = 0; i < items.length; i++) {
          if (!items[i].isSafeToComplete && !items[i].isComplete) {
            items[i].isSafeToComplete = true;
            console.log("is item, " + items[i].name + ", Safe to complete? " + items[i].isSafeToComplete);
          } else if (items[i].isSafeToComplete && !items[i].isComplete) {
            items[i].isSafeToComplete = false;
          }
          items.$save(items[i]);
        }
      },

// The function below marks item as complete or incomplete depending on its original state.  It is called by 'userincompleteItems.html' by the delete button and by 'userCompleteItems.html' by the modal.
      updateCompletion: function(item) {
        var item = items.$getRecord(item.$id);

        if (!item.isComplete) {
          item.isComplete = true;
          item.completed_at = firebase.database.ServerValue.TIMESTAMP;

          // deleting item, changing its dataItems props
          var hourDiff = item.eHour * -1;
          var minuteDiff = item.eMinute * -1;

          addOrUpdateDataItems("itemLeftCount", "hoursLeft", "minutesLeft", -1, hourDiff, minuteDiff);
          addOrUpdateDataItems("itemWorkedCount", "hoursWorked", "minutesWorked", 1, item.eHour, item.eMinute);

          // alternative addOrUpdateDataItems code:
          // var propArray = ["itemLeftCount", "hoursLeft", "minutesLeft", "itemWorkedCount", "hoursWorked", "minutesWorked"];
          // var valArray = [-1, hourDiff, minuteDiff, 1, item.eHour, item.eMinute];
          // addOrUpdateDataItems(propArray, valArray);

          if (item.isPastDue) {
            addOrUpdateDataItems("itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete", 1, item.eHour, item.eMinute);
          // deleting item that was pastDue, changing its dataItems props

          // alternative addOrUpdateDataItems code:
          // var propArray = ["itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete"];
          // var valArray = [1, item.eHour, item.eMinute];
          // addOrUpdateDataItems(propArray, valArray);
          }
        } else if (item.isComplete) {
          item.isComplete = false;
          item.completed_at = 0;

          // undeleting item, changing its dataItems props
          var hourDiff = item.eHour * -1;
          var minuteDiff = item.eMinute * -1;

          addOrUpdateDataItems("itemWorkedCount", "hoursWorked", "minutesWorked", -1, hourDiff, minuteDiff);
          addOrUpdateDataItems("itemLeftCount", "hoursLeft", "minutesLeft", 1, item.eHour, item.eMinute);

          // alternative addOrUpdateDataItems code:
          // var propArray = ["itemWorkedCount", "hoursWorked", "minutesWorked", "itemLeftCount", "hoursLeft", "minutesLeft"];
          // var valArray = [-1, hourDiff, minuteDiff, 1, item.eHour, item.eMinute];
          // addOrUpdateDataItems(propArray, valArray);


          if (item.isPastDue) {

            addOrUpdateDataItems("itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete", -1, hourDiff, minuteDiff);

            // alternative addOrUpdateDataItems code:
            // var propArray = ["itemDueCompleteCount", "hoursDueComplete", "minutesDueComplete"];
            // var valArray = [-1, hourDiff, minuteDiff];
            // addOrUpdateDataItems(propArray, valArray);
          }
        }
        items.$save(item);
      }

    }; // end of Return

  } // end of ItemCrud function
]); // end of factory initialization
