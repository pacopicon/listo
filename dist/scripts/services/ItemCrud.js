
listo.factory("ItemCrud", ["$firebaseArray",
  function($firebaseArray) {

  // downloads data
    var ref = new Firebase("https://listo-1f3db.firebaseio.com/");

        // holds items
    var items = $firebaseArray(ref);

    var dueDatePlusDueTime = function(dueDate, dueTime) {
      var dueHour = dueTime.getHours();
      var dueMinute = dueTime.getMinutes();
      var dueDatePlusHour =  dueDate.setHours(dueHour);
      // dueDatePlusHour is now a Number object in milliseconds
      var dueDatePlusHourDateObj = new Date(dueDatePlusHour);
      var setMinute = dueDatePlusHourDateObj.setMinutes(dueMinute);
      // setMinute is now a Number object in milliseconds
      var DueDateTotalDateObj = new Date(setMinute);
      return DueDateTotalDateObj;
    };

    var calculateEstTimeAsDateNum = function(eHour, eMinute) {
      var dummyDate = new Date(1970, 0, 1, 0, 0, 0);
      var estTimeAsDateNum = dummyDate.setHours(eHour, eMinute, 0, 0);
      return estTimeAsDateNum;
      // The returned value will be able to be displayed with a date type on user.html
    };

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
      console.log(urgencyTxt);
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

    var prioritize = function(dueDate, eHour, eMinute, importanceTxt) {

      // var stringifiedDate = stringifyDate(dueDate);
      // var totalDueDate = dueDatePlusDueTime(dueDate, dueTime);
      // var timeTillDueDate = totalDueDate.getTime() - Date.now();
      var timeTillDueDate = dueDate.getTime() - Date.now();
      var estTimeAsDateNum = calculateEstTimeAsDateNum(eHour, eMinute);
      // estTime comes out in milliseconds and does not go into the database, it is used by calculate ratio below
      var estTime = calculateEstTime(eHour, eMinute);
      // ratio does not go into DB, but is used to figure out RANK below (words in all-caps refer to things that DO go into the DB)
      var ratio = calculateTimeEstTimeTillDueRatio(timeTillDueDate, estTime);
      // urgency is used to calculate both RANK and URGENCYTXT below
      var urgency = calculateUrgency(ratio);
      var urgencyTxt = createUrgencyTxt(urgency);
      var rank = calculateRank(importanceTxt, ratio, urgency);

      return {
        // totalDueDate: totalDueDate,
        estTimeAsDateNum: estTimeAsDateNum,
        urgencyTxt: urgencyTxt,
        rank: rank
      };
    };

    return {

      parseTime: function(timeInMillisecs) {
                // 'time' has to be in milliseconds
        var millisecsInYear = 12 * 30.4166 * 24 * 60 * 60 * 1000;
        var millisecsInMonth = 30.4166 * 24 * 60 * 60 * 1000;
        var millisecsInDay = 24 * 60 * 60 * 1000;
        var millisecsInHour = 60 * 60 * 1000;
        var millisecsInMinute = 60 * 1000;
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

      calculateTimeTillUnitsX: function(time) {
        for (i = 0; i < items.length; i++) {
          var eachItem = items[i]
          eachItem.e_currentTime = time;

          if (typeof eachItem.b_dueDate === "object") {
              eachItem.b_dueDate = eachItem.b_dueDate.getTime();
          }

          var timeTillDueDate = eachItem.b_dueDate - time;

          var timeTillUnit = parseTimeX(timeTillDueDate);

          eachItem.f_tillDue = timeTillDueDate;
          eachItem.g_yearsTillDue = timeTillUnit.year;
          eachItem.h_monthsTillDue = timeTillUnit.month;
          eachItem.i_daysTillDue = timeTillUnit.day;
          eachItem.j_hoursTillDue = timeTillUnit.hour;
          eachItem.k_minutesTillDue = timeTillUnit.minute;
          eachItem.l_secondsTillDue = timeTillUnit.second;

          eachItem.o_timeToFinishDate = calculateEstTimeAsDateNum(eachItem.m_hoursToFinish, eachItem.n_minutesToFinish);

          var estTime = calculateEstTime(eachItem.m_hoursToFinish, eachItem.n_minutesToFinish);
          var ratio = calculateTimeEstTimeTillDueRatio(timeTillDueDate, estTime);
          var urgency = calculateUrgency(ratio);
          eachItem.r_urgent = createUrgencyTxt(urgency);
          eachItem.s_rank = calculateRank(eachItem.p_importance, ratio, urgency);

          items.$save(eachItem).then(function() {
              // console.log(time);
          });
        }
      },

      // updateItem: function() {
      //     // changes
      //     items.$save(item)
      // }

      addItem: function(itemName, dueDate, eHour, eMinute, importanceTxt) {
        // var stringifiedDate = stringifyDate(dueDate);

        // var itemProperty = prioritize(dueDate, dueTime, eHour, eMinute, importanceTxt);
        var itemProperty = prioritize(dueDate, eHour, eMinute, importanceTxt);

        console.log("selected phrase: " + importanceTxt);

        items.$add({

            a_text: itemName,
            b_dueDate: dueDate.getTime(),
            // b_dueDate: itemProperty.totalDueDate.getTime(),
            // c_dueDateString: stringifiedDate,
            m_hoursToFinish: eHour,
            n_minutesToFinish: eMinute,
            o_timeToFinishDate: itemProperty.estTimeAsDateNum,
            p_importance: importanceTxt,
            q_completed: false,
            qq_pastDue: false,
            r_urgent: itemProperty.urgencyTxt,
            s_rank: itemProperty.rank,
            t_created_at: Firebase.ServerValue.TIMESTAMP
        }).then(function(ref) {
          var id = ref.key();
          console.log("added item with id " + id);
          items.$indexFor(id);
        });
      }, // end of AddItem

      updateDueDate: function(dateAndTimeObj) {
        var id = ref.key();
        items.b_dueDate = dateAndTimeObj.getTime();


        var updatedItem = items.$getRecord(id);
        console.log("item from id " + items.$getRecord(id));
        items.$save(updatedItem);
      },

      updateRank: function() {
        items.s_rank = prioritize(item.b_dueDate, dueTime, eHour, eMinute, importanceTxt);
      },

      getAllItems: function() {
        return items;
      },

      getAllUncompletedItems: function() {
        var uncompletedItems = [];
        var totalItems = items.length;

        for (var i = 0; i < totalItems; i++) {
          if (!items[i].isCompleted) {
            uncompletedItems.push(items[i]);
          }
        }
        return uncompletedItems;
      },

      getAllCompletedItems: function() {
        var completedItems = [];
        var totalItems = items.length;

        for (var i = 0; i < totalItems; i++) {
          if (items[i].isCompleted) {
            completedItems.push(items[i]);
          }
        }
        return completedItems;
      },

      getAllItemsPastDue: function() {
        var itemsPastDue = [];
        var totalItems = items.length;

        var now = new Date().getTime();

        for (var i = 0; i < totalItems; i++) {
          if (items[i].b_dueDate < now) {
            completedItems.push(items[i]);
          }
        }
        return completedItems;
      }


    }; // end of Return

  } // end of firebase function
]); // end of factory initialization
