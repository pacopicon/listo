listo.factory("ItemCrud", ["$firebaseArray",
    function($firebaseArray) {

    // downloads data
        var ref = new Firebase("https://listo-1f3db.firebaseio.com/");

        // holds items
        var items = $firebaseArray(ref);

        return {

            setDueDateClockTime: function(dDate, dTime) {
                var hours = dTime.getHours();
                var minutes = dTime.getMinutes();
                var seconds = dTime.getSeconds();
                var milliseconds = dTime.getMilliseconds();

                return dDate.setHours(hours, minutes, seconds, milliseconds);
            },

            calculateTimeTillDueDate: function(correctedDueDate) {
                var timeTillDueDate = correctedDueDate - Date.now();

                return timeTillDueDate;
            },

            calculateEstTime: function(eHour, eMinute) {
                var estTime = (eHour * 60 * 60 * 1000) + (eMinute * 60 * 1000);
                return estTime;
            },

            calculateEstTimeAsDateObj: function(eHour, eMinute) {
                var dummyDate = new Date(1970, 0, 1, 0, 0, 0);
                var estTimeAsDateObj = dummyDate.setHours(eHour, eMinute, 0, 0);
                return estTimeAsDateObj;
            },

            calculateTimeEstTimeTillDueRatio: function(timeTillDueDate, estTime) {
                var ratio = estTime / timeTillDueDate;
                return ratio;
            },

            calculateUrgency: function(ratio) {
                if (ratio >= 0.4) {
                  urgency = true;
                } else {
                  urgency = false;
                }

                return urgency;
            },

            createUrgencyTxt: function(urgency) {
                if (urgency === true) {
                  urgencyTxt = "'urgent'";
                } else {
                  urgencyTxt = "'not urgent'";
                }

                return urgencyTxt;
            },

            calculateRank: function(importanceTxt, ratio, urgency) {
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
            },

            addItem: function(itemName, dueDate, timeTillDueDate, estTime, estTimeAsDateObj, importanceTxt, urgencyTxt, rank) {

              var parseTime = function(timeInMillisecs) {
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
                      year: Math.round(years),
                      month: Math.round(months),
                      day: Math.round(days),
                      hour: Math.round(hours),
                      minute: Math.round(minutes),
                      second: Math.round(seconds)
                  };    
              };

                items.$add({
                    text: itemName,
                    dueDate: dueDate,
                    tillDue: parseTime(timeTillDueDate),
                    // parseTime(timeVarInMillisecs).year
                    // parseTime(timeVarInMillisecs).month
                    // parseTime(timeVarInMillisecs).day
                    // parseTime(timeVarInMillisecs).hour
                    // parseTime(timeVarInMillisecs).minute
                    // parseTime(timeVarInMillisecs).second
                    timeToFinish: estTimeAsDateObj,
                    importance: importanceTxt,
                    completed: false,
                    urgent: urgencyTxt,
                    rank: rank,
                    created_at: Firebase.ServerValue.TIMESTAMP
                });
            }, // end of AddItem

            getAllItems: function() {
                return items;
            }
        }; // end of Return

    } // end of firebase function
]); // end of factory initialization
