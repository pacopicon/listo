listo.factory("ItemCrud", ["$firebaseArray",
  function($firebaseArray) {

// downloads data from Firebase database
    var ref = new Firebase("https://listo-1f3db.firebaseio.com/");
// Remember, Firebase only accepts object, array, string, number, boolean, or null (see: https://www.firebase.com/docs/web/api/firebase/set.html)

// holds data as array of objects.  Each object is one item.
    var items = $firebaseArray(ref);

    var checkIfComplete = function(item) {
      if (item.q_completed == true) {
        return item;
      }
    };

// Public variables below
    var now = Date.now();
    var week = 604800000;
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

// The function below is used by the item completion functions, located in lines 220 and 263 below, in order to display hours and minutes worked for completed items and hours and minutes yet to be worked for incomplete items.
    var clockTime = function(totalHour, totalMin) {
      var totalTime = (totalHour * 60) + totalMin;
      var wholeHoursOnly = Math.floor(totalTime / 60);
      var wholeMinsOnly = totalTime % 60;
      var milliseconds = ((3600000 * wholeHoursOnly) + (60000 * wholeMinsOnly));
      return {
        hours: wholeHoursOnly,
        minutes: wholeMinsOnly,
        milliseconds: milliseconds
      }
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
    var calculateRank = function(importanceTxt, ratio, urgency) {
      // if urgency = true, then it helps to create a higher importanceMultiple than otherwise (see beneath)
      if (urgency) {
        urgencyAddend = 2.9;
      } else {
        urgencyAddend = 0;
      }
      // the below calculates the importanceMultiple according to the importance given by the user to the item
      if (importanceTxt == '!!!!!') {
        importanceMultiple = 3 + urgencyAddend;
      } else if (importanceTxt == '!!!!') {
        importanceMultiple = 2.5 + urgencyAddend;
      } else if (importanceTxt == '!!!') {
        importanceMultiple = 2 + urgencyAddend;
      } else if (importanceTxt == '!!') {
        importanceMultiple = 1.5 + urgencyAddend;
      } else {
        importanceMultiple = 1.1 + urgencyAddend;
      }
      // The Ranking calculation below prioritizes to do items whose estimated time to completion are larger relative to their time till due dates.  The second influence is the importance factor, however this is not as important unless the item is due soon as well.
      var rank = Math.round((ratio * importanceMultiple + ratio) * 1000000);
      return rank;
    };
// The function below calls all of the public functions related to Rank above in order to return 'rank' and 'urgency'.  This function is called both when an item is newly created and when it is updated.
    var prioritize = function(item, dueDate, importanceTxt, newUrgency, eHour, eMinute) {
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
      var rank = calculateRank(importanceTxt, ratio, currentUrgency);
      return {
        urgency: currentUrgency,
        rank: rank
      };
    };

// -- FUNCTIONS CALLED BY CONTROLLER --
    return {
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
      addItem: function(itemName, dueDate, importanceTxt, eHour, eMinute) {
        // empty the below variables in order to contextualize the 'prioritize' call for the 'addItem' function
        var item = null;
        var urgency = null;

        var itemProperties = prioritize(item, dueDate, importanceTxt, urgency, eHour, eMinute);
        // the below function lists the properties inside the item being created
        items.$add({
          a_text: itemName,
          b_dueDate: dueDate.getTime(),
          m_hoursToFinish: eHour,
          n_minutesToFinish: eMinute,
          p_importance: importanceTxt,
          q_completed: false,
          qq_pastDue: false,
          r_urgent: itemProperties.urgency,
          s_rank: itemProperties.rank,
          t_created_at: Firebase.ServerValue.TIMESTAMP
        }).then(function(ref) {
          var id = ref.key();
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

        oldItem.a_text = newName;
        oldItem.b_dueDate = newDueDate;
        oldItem.p_importance = newImportance;
        oldItem.r_urgent = updatedItemProperties.urgency;
        oldItem.m_hoursToFinish = newHours;
        oldItem.n_minutesToFinish = newMinutes;
        oldItem.s_rank = updatedItemProperties.rank;

        items.$save(oldItem).then(function(ref) {
          console.log("items.$save called");
        });
      },
// called by UserCtrl in order to populate items in DOM via $scope
      getAllItems: function() {
        return items;
      },
// function below gathers data for items marked as complete.  It is called by UserCtrl function '$scope.completionData' when this latter is called when (1) userincompleteItems.html is initialized and (2) when '$scope.markAsComplete', (3) '$scope.markAsIncomplete', (4) '$scope.updateItem', and (5) '$scope.addItem' are called.
      tallyCompleteItems: function () {
        var itemCount = 0;
        var hours = 0;
        var minutes = 0;
        var totalItems = items.length;

        for (var i = 0; i < totalItems; i++) {
          if (items[i].q_completed) {
            itemCount++;
            hours = hours + items[i].m_hoursToFinish;
            minutes = minutes + items[i].n_minutesToFinish;
          }
        }

        var hoursWorked = clockTime(hours, minutes).hours;
        var minutesWorked = clockTime(hours, minutes).minutes;
        var millisecondsWorked = clockTime(hours, minutes).milliseconds;

        return {
          hoursWorked: hoursWorked,
          minutesWorked: minutesWorked,
          millisecondsWorked: millisecondsWorked,
          itemCount: itemCount
        }
      },
// Similar to function above, the one below gathers data for items marked as INcomplete.  It is called by UserCtrl function '$scope.completionData' when this latter is called when (1) userincompleteItems.html is initialized and (2) when '$scope.markAsComplete', (3) '$scope.markAsIncomplete', (4) '$scope.updateItem', and (5) '$scope.addItem' are called.

      tallyIncompleteItems: function () {
        var itemCount = 0;
        var hours = 0;
        var minutes = 0;
        var totalItems = items.length;

        for (var i = 0; i < totalItems; i++) {
          if (!items[i].q_completed) {
            itemCount++;
            hours = hours + items[i].m_hoursToFinish;
            minutes = minutes + items[i].n_minutesToFinish;
          }
        }

        var hoursLeft = clockTime(hours, minutes).hours;
        var minutesLeft = clockTime(hours, minutes).minutes;
        var millisecondsLeft = clockTime(hours, minutes).milliseconds;

        return {
          hoursLeft: hoursLeft,
          minutesLeft: minutesLeft,
          millisecondsLeft: millisecondsLeft,
          itemCount: itemCount
        }
      },

      tallyOverdue: function () {
        var overdueCount = 0;
        var hours = 0;
        var minutes = 0;
        var totalItems = items.length;

        for (var i = 0; i < totalItems; i++) {
          if (items[i].qq_pastDue) {
            overdueCount++;
            hours = hours + items[i].m_hoursToFinish;
            minutes = minutes + items[i].n_minutesToFinish;
          }
        }

        var hoursOverdue = clockTime(hours, minutes).hours;
        var minutesOverdue = clockTime(hours, minutes).minutes;
        var millisecondsOverdue = clockTime(hours, minutes).milliseconds;

        return {
          hoursOverdue: hoursOverdue,
          minutesOverdue: minutesOverdue,
          millisecondsOverdue: millisecondsOverdue,
          overdueCount: overdueCount
        }
      },
// The function below is the actual deletion process for items.  The user has the power to only mark items as complete.  Complete or Past Due (i.e. incomplete but not marked as complete after the due date) items are rescuable and able to be set as incomplete for up to a week.  After one week, all Complete and Past Due items are deleted when this function is called by UserCtrl function '$scope.refreshTalliesAndData', which is called when (1) 'userincompleteItems.html' is initialized, and when either (2) '$scope.updateItems', or (3) '$scope.addItem', or (4) '$scope.updateCompletion' are called.
      processOldCompleteItems: function () {
        var totalItems = items.length;

        for (var i = 0; i < totalItems; i++) {
          if (items[i].q_completed && items[i].b_dueDate + week < now) {

            // 'date' is part of the console.log
            var date = new Date(items[i].b_dueDate);

            console.log("item named " + items[i].a_text + " with date: " + date + ", is about to be removed");
            items.$remove(items[i]).then(function() {
              if (items[i] != undefined) {
                console.log("item named " + items[i].a_text + "has still not been deleted");
              } else {
                console.log("item, which is now " + items[i] + ", has been removed");
              }
            });
            // Still figuring out how to $destroy items and avoid memory leaks.
            // items.$destroy(items[i]);
          }
        }
      },
// The function below updates items that are past due (i.e. incomplete but not marked as complete after the due date) with pastDue = true.  It also tallies these items.  It is called by UserCtrl function '$scope.refreshTalliesAndData'
      updateAllItemsPastDue: function() {
        var itemCount = 0;
        var totalItems = items.length;

        for (var i = 0; i < totalItems; i++) {
          if (items[i].b_dueDate < now) {
            items[i].qq_pastDue = true;
            items.$save(items[i]);
            itemCount++;
          } else {
            items[i].qq_pastDue = false;
            items.$save(items[i]);
            itemCount--;
          }
        }
        return itemCount;
      },

// The function below marks item as complete or incomplete depending on its original state.  It is called by 'userincompleteItems.html' by the delete button and by 'userCompleteItems.html' by the modal.
      updateCompletion: function(item) {
        var itemToBeUpdated = items.$getRecord(item.$id);

        if (itemToBeUpdated.q_completed == false) {
          itemToBeUpdated.q_completed = true;
        } else {
          itemToBeUpdated.q_completed = false;
        }
        items.$save(itemToBeUpdated);
      },

    }; // end of Return

  } // end of firebase function
]); // end of factory initialization
