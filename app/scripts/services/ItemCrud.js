listo.factory("ItemCrud", ["$firebaseArray",
    function($firebaseArray) {

    // downloads data
        var ref = new Firebase("https://listo-1f3db.firebaseio.com/");

        // holds items
        var items = $firebaseArray(ref);

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
                second: seconds
            };    
        };

        return {

            // parseTime: function(timeInMillisecs) {
            //     parseTime(timeInMillisecs)
            // },

            saveCurrentTime: function(time) {
                // console.log(time);
                for (i = 0; i < items.length; i++) {
                    var eachItem = items[i]
                    eachItem.currentTime = time;

                    var timeTillDueDate = eachItem.dueDate - time;
                    var timeTillUnit = parseTime(timeTillDueDate);

                    eachItem.tillDue = timeTillDueDate;
                    eachItem.yearsTillDue = timeTillUnit.year;
                    eachItem.monthsTillDue = timeTillUnit.month;
                    eachItem.daysTillDue = timeTillUnit.day;
                    eachItem.hoursTillDue = timeTillUnit.hour;
                    eachItem.minutesTillDue = timeTillUnit.minute;
                    eachItem.secondsTillDue = timeTillUnit.second;

                    items.$save(eachItem).then(function() {
                        // console.log(time);
                    });
                }
            },

            setDueDateClockTime: function(dDate, dTime) {
                var hours = dTime.getHours();
                var minutes = dTime.getMinutes();
                var seconds = dTime.getSeconds();
                var milliseconds = dTime.getMilliseconds();
                var correctedDueDate =  dDate.setHours(hours, minutes, seconds, milliseconds);
                return correctedDueDate;
            },

            calculateTimeTillDueDate: function(correctedDueDate) {
                var timeTillDueDate = correctedDueDate - Date.now();

                return timeTillDueDate;
            },

            calculateEstTime: function(eHour, eMinute) {
                var estTime = (eHour * 60 * 60 * 1000) + (eMinute * 60 * 1000);
                return estTime;
                // estTime comes out in milliseconds and does not go into the database, it is used by calculateTimeEstTimeTillDueRatio function below
            },

            calculateEstTimeAsDateObj: function(eHour, eMinute) {
                var dummyDate = new Date(1970, 0, 1, 0, 0, 0);
                var estTimeAsDateObj = dummyDate.setHours(eHour, eMinute, 0, 0);
                return estTimeAsDateObj;
                // like the name says, this is estTime as Date obj.
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

            addItem: function(itemName, dueDate, estTimeAsDateObj, importanceTxt, urgencyTxt, rank) {

                var timeTillDue = dueDate - Date.now();
                var timeTillUnit = parseTime(timeTillDue);

                items.$add({
                    text: itemName,
                    dueDate: dueDate,
                    currentTime: Date.now(),
                    tillDue: timeTillDue,
                    yearsTillDue: timeTillUnit.year,
                    monthsTillDue: timeTillUnit.month,
                    daysTillDue: timeTillUnit.day,
                    hoursTillDue: timeTillUnit.hour,
                    minutesTillDue: timeTillUnit.minute,
                    secondsTillDue: timeTillUnit.second,
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
