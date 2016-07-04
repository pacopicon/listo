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
                //    All variables are in seconds:
                var correctedDueDateInSecs = correctedDueDate;
                var timeTillDueDate = correctedDueDate - Date.now();

                return timeTillDueDate;
            },

            calculateEstTime: function(eHour, eMinute) {
                var estTime = (eHour * 60 * 60 * 1000) + (eMinute * 60 * 1000);
                return estTime;
            },

            calculateTimeEstTimeTillDueRatio: function(timeTillDueDate, estTime) {
                var ratio = estTime / timeTillDueDate;
                return ratio;
            },

            calculateUrgency: function(ratio) {

                if (ratio >= 0.5) {
                  urgency = true;
                } else {
                  urgency = false;
                }

                return urgency;
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

            addItem: function(itemName, dueDate, timeTillDueDate, estTime, importanceTxt, urgency, rank) {

                items.$add({
                    text: itemName,
                    dueDate: dueDate,
                    millisecsTillDueDate: timeTillDueDate,
                    millisecsToFinish: estTime,
                    importance: importanceTxt,
                    completed: false,
                    urgent: urgency,
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
