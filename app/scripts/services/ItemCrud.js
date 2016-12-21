listo.factory("ItemCrud", ["$firebaseArray",
  function($firebaseArray) {

  // downloads data
    var ref = new Firebase("https://listo-1f3db.firebaseio.com/");

        // holds items
    var items = $firebaseArray(ref);

    // $scope.findSeriesWithoutFactory = function() {
    //   var seriesRef = new Firebase(fbUrl+'/series');
    //   var seriesCollection = $firebaseArray(seriesRef);
    //
    //   seriesCollection.$ref().orderByChild("name").equalTo($scope.seriesName).once("value", function(dataSnapshot){
    //     var series = dataSnapshot.val();
    //     if(dataSnapshot.exists()){
    //       console.log("Found", series);
    //       $scope.series = series;
    //     } else {
    //       console.warn("Not found.");
    //     }
    //   });
    // };

    var now = Date.now();
    var week = 604800000;

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
        urgencyTxt = "7kuyes";
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

      var timeTillDueDate = dueDate - now;

      // estTime comes out in milliseconds and does not go into the database, it is used by calculate ratio below
      var estTime = calculateEstTime(eHour, eMinute);
      // ratio does not go into DB, but is used to figure out RANK below (words in all-caps refer to things that DO go into the DB)

      var ratio = calculateTimeEstTimeTillDueRatio(timeTillDueDate, estTime);

      if (item === null) {
        // urgency is used to calculate RANK
        var currentUrgency = calculateUrgency(ratio);
      } else {
        var currentUrgency = newUrgency;
      }

      var rank = calculateRank(importanceTxt, ratio, currentUrgency);
      return {
        urgency: currentUrgency,
        rank: rank
      };
    };

    var clockTime = function(totalHour, totalMin) {
      var totalTime = (totalHour * 60) + totalMin;
      var wholeHoursOnly = Math.floor(totalTime / 60);
      var wholeMinsOnly = totalTime % 60;
      var milliseconds = ((3600000 * wholeHoursOnly) + (60000 * wholeMinsOnly));

      // console.log("clockTime called returning: " + wholeHoursOnly + " and " + wholeMinsOnly);

      return {
        hours: wholeHoursOnly,
        minutes: wholeMinsOnly,
        milliseconds: milliseconds
      }
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

      updateItem: function(oldItem, newName, newDueDate, newImportance, newUrgent, newHours, newMinutes) {

        if (typeof newDueDate == "object") {
          var newDueDate = newDueDate.getTime();
        } else if (typeof newDueDate != "number") {
          console.log("dueDate, " + newDueDate + ", is neither a Date Object nor a number, but a " + typeof newDueDate + ".");
        } else {
          console.log("dueDate is a " + typeof newDueDate + ".");
        }

        // var itemToBeUpdated = items.$getRecord(item.$id);

        var updatedItemProperties = prioritize(oldItem, newDueDate, newImportance, newUrgent, newHours, newMinutes);

        var t = new Date();
        console.log("step 5 - ItemCrud.updateItem old name: " + oldItem.name + " and name: " + newName + " and item date " + newDueDate + ". Time: " + t.getMinutes() + ":" + t.getSeconds() + ":" + t.getMilliseconds());

        oldItem.a_text = newName;
        oldItem.b_dueDate = newDueDate;
        oldItem.p_importance = newImportance;
        oldItem.r_urgent = updatedItemProperties.urgency;
        oldItem.s_rank = updatedItemProperties.rank;

        items.$save(oldItem).then(function(ref) {
          console.log("items.$save called");
        });
      },

      updateItemCompletion: function(item, completion) {

        var itemToBeUpdated = items.$getRecord(item.$id);
        itemToBeUpdated.q_completed = completion;

        items.$save(itemToBeUpdated);
      },

      getAllItems: function() {
        return items;
      },

      // getIncompleteItems: function() {
      //   var incompleteItems = [];
      //   var totalItems = items.length;
      //
      //   for (var i = 0; i < totalItems; i++) {
      //     if (!items[i].q_completed) {
      //       incompleteItems.push(items[i]);
      //     }
      //   }
      //   return incompleteItems;
      //   console.log("getIncompleteItems called, incompleteItems: " + incompleteItems.length);
      // },
      //
      // getCompleteItems: function() {
      //   var completeItems = [];
      //   var totalItems = items.length;
      //
      //   for (var i = 0; i < totalItems; i++) {
      //     if (items[i].q_completed) {
      //       completeItems.push(items[i]);
      //     }
      //   }
      //   return completeItems;
      //   console.log("getCompleteItems called, completeItems: " + completeItems.length);
      // },
      // completedAt: timestamp

      itemsComplete: function () {
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

          if (items[i].q_completed && items[i].b_dueDate + week < now) {

            console.log("item named " + items[i].a_text + " is about to be removed");

            items.$remove(items[i]).then(function() {

              if (items[i] != undefined) {
                console.log("item named " + items[i].a_text + "has still not been deleted");
              } else {
                console.log("item, which is now " + items[i] + ", has been removed");
              }

            itemsComplete();
            });
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

      itemsIncomplete: function () {
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

      // getIncompleteItems: function() {
      //   var incompleteItems = [];
      //
      //   items.$loaded().then(function(items) {
      //     var totalItems = items.length;
      //
      //     for (var i = 0; i < totalItems; i++) {
      //       if (!items[i].q_completed) {
      //         incompleteItems.push(items[i]);
      //       }
      //     }
      //     return incompleteItems;
      //   });
      // },
      //
      // getCompleteItems: function() {
      //   var completeItems = [];
      //
      //   items.$loaded().then(function(items) {
      //     var totalItems = items.length;
      //
      //     for (var i = 0; i < totalItems; i++) {
      //       if (items[i].q_completed) {
      //         completeItems.push(items[i]);
      //       }
      //
      //       if (items[i].q_completed && items[i].b_dueDate + week < now) {
      //         items.$remove(items[i]).then(function() {
      //         });
      //       }
      //     }
      //     return completeItems;
      //   });
      //
      //   return completeItems;
      //
      // },

      getItemsPastDue: function() {
        var itemsPastDue = [];
        var totalItems = items.length;

        for (var i = 0; i < totalItems; i++) {
          // var now = Date.now();
          // var week = 604800000;
          var itemExpirationDatePlusWeek = now + week;

          if (items[i].b_dueDate < now) {
            items[i].qq_pastDue = true;
            items.$save(items[i]).then(function () {
              // console.log("The item called " + items[i].a_text + "is past due!");
            });
            itemsPastDue.push(items[i]);
          }

          if (items[i].b_dueDate + week < now) {
            items.$remove(items[i]).then(function() {
              // console.log("The item called " + items[i].a_text + "has been past due for a week and has now been erased from the database");
            });
          }

        }
        return itemsPastDue;
        console.log("getItemsPastDue was called, itemsPastDue array has: " + itemsPastDue.length + "items past due");
      },

      markAsCompleted: function(item) {
        // marks the item as completed
        var itemToBeCrossedOut = items.$getRecord(item.$id);
        itemToBeCrossedOut.q_completed = true;

        items.$save(itemToBeCrossedOut);
      },

      uncrossOutItem: function(crossedOutItem, updatedDueDate, updatedImportance, updatedUrgency, updatedHour, updatedMinute) {
        var itemToBeUncrossed = items.$getRecord(queriedItem.$id);

        var updatedItemProperties = prioritize(crossedOutItem, updatedDueDate, updatedImportance, updatedUrgency, updatedHour, updatedMinute);

        itemToBeUncrossedOut.q_completed = false;
        itemToBeUncrossedOut.b_dueDate = updatedDueDate.getTime();
        itemToBeUncrossedOut.p_importance = updatedImportance;
        itemToBeUncrossedOut.r_urgent = updatedItemProperties.urgency;
        itemToBeUncrossedOut.s_rank = updatedItemProperties.rank;

        items.$save(itemToBeCrossedOut);
      }

    }; // end of Return

  } // end of firebase function
]); // end of factory initialization
