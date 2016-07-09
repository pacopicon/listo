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
            var seconds = Math.floor(lessThanMinute / millisecsInSecs);

            return {
                year: Math.floor(years),
                month: Math.floor(months),
                day: Math.floor(days),
                hour: Math.floor(hours),
                minute: Math.floor(minutes),
                second: seconds
            };    
        };

        var setDueDateClockTime = function(dueDate, dueTime) {
            // inputs are Date objects
            // output is Number object

            if (typeof dueDate === "number") {
                dueDate = new Date(dueDate);
            }

            if (typeof dueTime === "number") {
                dueTime = new Date(dueTime);
            }

            var hours = dueTime.getHours();
            var minutes = dueTime.getMinutes();
            var seconds = dueTime.getSeconds();
            var milliseconds = dueTime.getMilliseconds();
            // console.log("this is are the hours: " + hours + ", minutes: " + minutes + ", seconds: " + seconds);
            var correctedDueDate =  dueDate.setHours(hours, minutes, seconds, milliseconds);
            return correctedDueDate;
        };

        var calculateEstTimeAsDateNum = function(eHour, eMinute) {
            var dummyDate = new Date(1970, 0, 1, 0, 0, 0);
            var estTimeAsDateObj = dummyDate.setHours(eHour, eMinute, 0, 0);
            return estTimeAsDateObj;
            // like the name says, this is estTime as Date obj.
        };

        var calculateEstTime = function(eHour, eMinute) {
            var estTime = (eHour * 60 * 60 * 1000) + (eMinute * 60 * 1000);
            return estTime;
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
              urgencyTxt = "'urgent'";
            } else {
              urgencyTxt = "'not urgent'";
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

        return {

            refreshTimeAndDatabase: function(time) {
                for (i = 0; i < items.length; i++) {
                    var eachItem = items[i]
                    eachItem.e_currentTime = time;
                    eachItem.d_dueDateNum = setDueDateClockTime(eachItem.b_dueDate, eachItem.c_dueTime);

                    var timeTillDueDate = eachItem.d_dueDateNum - time;
                    var timeTillUnit = parseTime(timeTillDueDate);

                    eachItem.f_tillDue = timeTillDueDate;
                    eachItem.g_yearsTillDue = timeTillUnit.year;
                    eachItem.h_monthsTillDue = timeTillUnit.month;
                    eachItem.i_daysTillDue = timeTillUnit.day;
                    eachItem.j_hoursTillDue = timeTillUnit.hour;
                    eachItem.k_minutesTillDue = timeTillUnit.minute;
                    eachItem.l_secondsTillDue = timeTillUnit.second;

                    eachItem.o_timeToFinishObj = calculateEstTimeAsDateNum(eachItem.m_hoursToFinish, eachItem.n_minutesToFinish);

                    var estTime = calculateEstTime(eachItem.m_hoursToFinish, eachItem.n_minutesToFinish);
                    var ratio = calculateTimeEstTimeTillDueRatio(timeTillDueDate, estTime);
                    var urgency = calculateUrgency(ratio);
                    var urgencyTxt = createUrgencyTxt(urgency);
                    var rank = calculateRank(eachItem.p_importance, ratio, urgency);

                    items.$save(eachItem).then(function() {
                        // console.log(time);
                    });
                }
            },

            addItem: function(itemName, dueDate, dueTime, eHour, eMinute, importanceTxt) {

                console.log("this should be dueTime: " + dueTime);

                var dueDateNum = setDueDateClockTime(dueDate, dueTime);
                var timeTillDueDate = dueDateNum - Date.now();
                var timeTillUnit = parseTime(timeTillDueDate);
                var estTimeAsDateObj = calculateEstTimeAsDateNum(eHour, eMinute);
                // estTime comes out in milliseconds and does not go into the database, it is used by calculate ratio below
                var estTime = calculateEstTime(eHour, eMinute);
                // ratio does not go into DB, but is used to figure out RANK below (words in all-caps refer to things that DO go into the DB)
                var ratio = calculateTimeEstTimeTillDueRatio(timeTillDueDate, estTime);
                // urgency is used to calculate both RANK and URGENCYTXT below
                var urgency = calculateUrgency(ratio);
                var urgencyTxt = createUrgencyTxt(urgency);
                var rank = calculateRank(importanceTxt, ratio, urgency);


                items.$add({

                    // the properties below are added directly by user selection:
                    a_text: itemName,
                    b_dueDate: dueDate.getTime(),
                    c_dueTime: dueTime.getTime(),
                    // the properties below is calculated in this factory:
                    d_dueDateNum: dueDateNum,
                    e_currentTime: Date.now(),
                    f_tillDue: timeTillDueDate,
                    g_yearsTillDue: timeTillUnit.year,
                    h_monthsTillDue: timeTillUnit.month,
                    i_daysTillDue: timeTillUnit.day,
                    j_hoursTillDue: timeTillUnit.hour,
                    k_minutesTillDue: timeTillUnit.minute,
                    l_secondsTillDue: timeTillUnit.second,
                    // the properties below are added directly by user selection:
                    m_hoursToFinish: eHour,
                    n_minutesToFinish: eMinute,
                    // the properties below is calculated in this factory:
                    o_timeToFinishObj: estTimeAsDateObj,
                    // the properties below are added directly by user selection:
                    p_importance: importanceTxt,
                    // the properties below is calculated in this factory:
                    q_completed: false,
                    // the properties below are added directly by user selection:
                    r_urgent: urgencyTxt,
                    // the properties below is calculated in this factory:
                    s_rank: rank,
                    t_created_at: Firebase.ServerValue.TIMESTAMP
                }).then(function(){console.log("I, the console.log, am attached to 'items.$add', use me to debug anything that happens around '$adding'")});
            }, // end of AddItem

            updateDueTiming: function(b_dueDate) {
                d_dueDateNum = b_dueDate.getTime();
                items.$save(item);
            },

            getAllItems: function() {
                return items;
            }
        }; // end of Return

    } // end of firebase function
]); // end of factory initialization
