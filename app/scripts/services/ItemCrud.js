
listo.factory("ItemCrud", ["$firebaseArray",
  function($firebaseArray) {

  // downloads data
    var ref = new Firebase("https://listo-1f3db.firebaseio.com/");

        // holds items
    var items = $firebaseArray(ref);

    var now = Date.now();
    var week = 604800000;

    // var dueDatePlusDueTime = function(dueDate, dueTime) {
    //   var dueHour = dueTime.getHours();
    //   var dueMinute = dueTime.getMinutes();
    //   var dueDatePlusHour =  dueDate.setHours(dueHour);
    //   // dueDatePlusHour is now a Number object in milliseconds
    //   var dueDatePlusHourDateObj = new Date(dueDatePlusHour);
    //   var setMinute = dueDatePlusHourDateObj.setMinutes(dueMinute);
    //   // setMinute is now a Number object in milliseconds
    //   var DueDateTotalDateObj = new Date(setMinute);
    //   return DueDateTotalDateObj;
    // };

    var calculateEstTime = function(eHour, eMinute) {
      var estTime = (eHour * 60 * 60 * 1000) + (eMinute * 60 * 1000);
      return estTime;
      // This is the exact estimated Time amount in milliseconds and is used to calculate Rank.
    };

    var calculateTimeEstTimeTillDueRatio = function(timeTillDueDate, estTime) {
      var ratio = estTime / timeTillDueDate;
      return ratio;
    };

    var calculateUrgency = function(ratio) {
      console.log("item is undefined and calculateUrgency was called");
      if (ratio >= 0.4) {
        urgency = true;
      } else {
        urgency = false;
      }

      return urgency;
    };

    var createUrgencyTxt = function(urgency) {
      if (urgency === true) {
        urgencyTxt = "yes";
      } else {
        urgencyTxt = "no";
      }

      return urgencyTxt;
    };

    var calculateRank = function(importanceTxt, ratio, urgency) {
      if (urgency) {
        urgencyAddend = 2.9;
      } else {
        urgencyAddend = 0;
      }
            // calculate importanceRating and exponent
      if (importanceTxt == 'job depends on it') {
        importanceMultiple = 3 + urgencyAddend;
      } else if (importanceTxt == 'pretty important') {
        importanceMultiple = 2.5 + urgencyAddend;
      } else if (importanceTxt == 'important') {
        importanceMultiple = 2 + urgencyAddend;
      } else if (importanceTxt == 'somewhat important') {
        importanceMultiple = 1.5 + urgencyAddend;
      } else {
        importanceMultiple = 1.1 + urgencyAddend;
      }

      var rank = Math.round((ratio * importanceMultiple + ratio) * 1000000);

      return rank;
    };

    var prioritize = function(item, dueDate, importanceTxt, newUrgency, eHour, eMinute) {

      console.log("newUrgency: " + newUrgency);

      var timeTillDueDate = dueDate.getTime() - now;
      // estTime comes out in milliseconds and does not go into the database, it is used by calculate ratio below
      var estTime = calculateEstTime(eHour, eMinute);
      // ratio does not go into DB, but is used to figure out RANK below (words in all-caps refer to things that DO go into the DB)

      var ratio = calculateTimeEstTimeTillDueRatio(timeTillDueDate, estTime);

      // if (item !== undefined ) {
      //   console.log("item with id " + items.$getRecord(item.$id) + "exists");
      // } else {
      //   console.log("item is not defined");
      // }

      if (item === null) {
        // urgency is used to calculate RANK
        var currentUrgency = calculateUrgency(ratio);
      } else {
        var currentUrgency = newUrgency;
      }

      console.log("currentUrgency: " + currentUrgency);

      var rank = calculateRank(importanceTxt, ratio, currentUrgency);
      return {
        urgency: currentUrgency,
        rank: rank
      };
    };

    return {

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

      calculateTimeTillDueDate: function(dueDate, time) {
        if (typeof dueDate === "object") {
          dueDate = dueDate.getTime();
        }

        timeLeftInMillisecs = dueDate - time;
        return timeLeftInMillisecs;
      },

      addItem: function(itemName, dueDate, importanceTxt, eHour, eMinute) {

        var item = null;
        var urgency = null;

        var itemProperties = prioritize(item, dueDate, importanceTxt, urgency, eHour, eMinute);

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

      updateItem: function(item, updatedDueDate, updatedImportance, updatedUrgency, updatedHour, updatedMinute) {
        console.log("updatedUrgency: " + updatedUrgency);
        console.log("updateItem was called");
        console.log("updateItem fn received " + updatedImportance);
        var itemToBeUpdated = items.$getRecord(item.$id);

        var updatedItemProperties = prioritize(item, updatedDueDate, updatedImportance, updatedUrgency, updatedHour, updatedMinute);

        itemToBeUpdated.b_dueDate = updatedDueDate.getTime();
        itemToBeUpdated.p_importance = updatedImportance;
        itemToBeUpdated.r_urgent = updatedItemProperties.urgency;
        itemToBeUpdated.s_rank = updatedItemProperties.rank;

        items.$save(itemToBeUpdated);
      },

      markAsCompleted: function(item) {
        // marks the item as completed
        var itemToBeCrossedOut = items.$getRecord(item.$id);
        itemToBeCrossedOut.q_completed = true;

        items.$save(itemToBeCrossedOut);
      },

      // updateDueDate: function(queriedItem, dateAndTimeObj) {
      //   var itemToBeUpdated = items.$getRecord(queriedItem.$id);
      //
      //   var eHour = itemToBeUpdated.m_hoursToFinish;
      //   var eMinute = itemToBeUpdated.n_minutesToFinish;
      //   var importanceTxt = itemToBeUpdated.p_importance;
      //
      //   var itemProperty = prioritize(itemToBeUpdated, dateAndTimeObj, importanceTxt, eHour, eMinute);
      //
      //   itemToBeUpdated.b_dueDate = dateAndTimeObj.getTime();
      //   itemToBeUpdated.r_urgent = itemProperty.urgency;
      //   itemToBeUpdated.s_rank = itemProperty.rank;
      //
      //   items.$save(itemToBeUpdated);
      // },

      getAllItems: function() {
        return items;
      },

      getUncompletedItems: function() {
        var uncompletedItems = [];
        var totalItems = items.length;

        for (var i = 0; i < totalItems; i++) {
          if (!items[i].q_completed) {
            uncompletedItems.push(items[i]);
          }
        }
        return uncompletedItems;
      },

      getCompletedItems: function() {
        var completedItems = [];
        var totalItems = items.length;

        for (var i = 0; i < totalItems; i++) {
          // var now = Date.now();
          // var week = 604800000;
          var itemExpirationDatePlusWeek = now + week;


          if (items[i].q_completed) {
            completedItems.push(items[i]);
          }

          if (items[i].q_completed && items[i].b_dueDate < itemExpirationDatePlusWeek) {
            items.$remove(item[1]).then(function() {
              console.log("The item called " + item[i].a_text + "has been long been completed and has now been erased from the database");
            });
          };
        }

        return completedItems;
      },

      getItemsPastDue: function() {
        var itemsPastDue = [];
        var totalItems = items.length;

        for (var i = 0; i < totalItems; i++) {
          // var now = Date.now();
          // var week = 604800000;
          var itemExpirationDatePlusWeek = now + week;

          if (items[i].b_dueDate < now) {
            items[i].qq_pastDue = true;
            items.$save(item[1]).then(function () {
              console.log("The item called " + item[i].a_text + "is past due!");
            });
            itemsPastDue.push(items[i]);
          }

          if (items[i].b_dueDate < itemExpirationDatePlusWeek) {
            items.$remove(item[1]).then(function() {
              console.log("The item called " + item[i].a_text + "has been past due for a week and has now been erased from the database");
            });
          }

        }
        return itemsPastDue;
      },

      uncrossOutItem: function(crossedOutItem, updatedDueDate) {
        var itemToBeUncrossed = items.$getRecord(queriedItem.$id);

        itemToBeUncrossedOut.q_completed = false;
        itemToBeUncrossedOut.b_dueDate = updatedDueDate.getTime();

        items.$save(itemToBeCrossedOut);
      },


    }; // end of Return

  } // end of firebase function
]); // end of factory initialization
