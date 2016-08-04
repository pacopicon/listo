
listo.factory("ItemCrud", ["$firebaseArray",
    function($firebaseArray) {

    // downloads data
        var ref = new Firebase("https://listo-1f3db.firebaseio.com/");

        // holds items
        var items = $firebaseArray(ref);

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

            // calculateTimeTillUnitsX: function(time) {
            //     for (i = 0; i < items.length; i++) {
            //         var eachItem = items[i]
            //         eachItem.e_currentTime = time;
            //
            //         if (typeof eachItem.b_dueDate === "object") {
            //             eachItem.b_dueDate = eachItem.b_dueDate.getTime();
            //         }
            //
            //         var timeTillDueDate = eachItem.b_dueDate - time;
            //
            //         var timeTillUnit = parseTimeX(timeTillDueDate);
            //
            //         eachItem.f_tillDue = timeTillDueDate;
            //         eachItem.g_yearsTillDue = timeTillUnit.year;
            //         eachItem.h_monthsTillDue = timeTillUnit.month;
            //         eachItem.i_daysTillDue = timeTillUnit.day;
            //         eachItem.j_hoursTillDue = timeTillUnit.hour;
            //         eachItem.k_minutesTillDue = timeTillUnit.minute;
            //         eachItem.l_secondsTillDue = timeTillUnit.second;
            //
            //         eachItem.o_timeToFinishDate = calculateEstTimeAsDateNum(eachItem.m_hoursToFinish, eachItem.n_minutesToFinish);
            //
            //         var estTime = calculateEstTime(eachItem.m_hoursToFinish, eachItem.n_minutesToFinish);
            //         var ratio = calculateTimeEstTimeTillDueRatio(timeTillDueDate, estTime);
            //         var urgency = calculateUrgency(ratio);
            //         eachItem.r_urgent = createUrgencyTxt(urgency);
            //         eachItem.s_rank = calculateRank(eachItem.p_importance, ratio, urgency);
            //
            //         items.$save(eachItem).then(function() {
            //             // console.log(time);
            //         });
            //     }
            // },

            addItem: function(itemName, dueDate, eHour, eMinute, importanceTxt) {

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


                items.$add({

                    a_text: itemName,
                    b_dueDate: dueDate.getTime(),
                    m_hoursToFinish: eHour,
                    n_minutesToFinish: eMinute,
                    o_timeToFinishDate: estTimeAsDateNum,
                    p_importance: importanceTxt,
                    q_completed: false,
                    r_urgent: urgencyTxt,
                    s_rank: rank,
                    t_created_at: Firebase.ServerValue.TIMESTAMP
                });
            }, // end of AddItem

            getAllItems: function() {
                return items;
            }
        }; // end of Return

    } // end of firebase function
]); // end of factory initialization
