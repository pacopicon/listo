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
                var correctedDueDateInSecs = correctedDueDate / 1000;
                var dateInSecs = Date.now() / 1000;
                var timeTillDueDate = correctedDueDate - dateInSecs;

                return timeTillDueDate;
            },

            calculateEstTime: function(eHour, eMinute) {
                var estTime = ((eHour * 60 * 60) + (eMinute * 60));
                return estTime;
            },

            calculateUrgency: function(timeTillDueDate, estTime) {

                if (timeTillDueDate <= (estTime + 3600)) {
                  urgency = true;
                } else {
                  urgency = false;
                }

                return urgency;
            },

            calculateRank: function(importanceTxt, timeTillDueDate, estTime, urgency) {
                // calculate dueDateRating
                var dueDateRating = ((31536000 + estTime - timeTillDueDate) / 100000);
                // calculate importanceRating and exponent
                if (!urgency && importanceTxt == 'job depends on it') {
                  importanceRating = 400;
                  exponent = 9.6;
                } else if (!urgency && importanceTxt == 'pretty important') {
                  importanceRating = 358;
                  exponent = 9.7;
                } else if (!urgency && importanceTxt == 'important') {
                  importanceRating = 319.25;
                  exponent = 9.8;
                } else if (!urgency && importanceTxt == 'somewhat important') {
                  importanceRating = 283.45;
                  exponent = 9.9;
                } else if (!urgency && importanceTxt == 'not important at all') {
                  importanceRating = 283.39;
                  exponent = 9.9;
                } else {
                  importanceRating = 400;
                  exponent = 10;
                }

                var bigDiv = Math.pow(10, 64);
                var rankingFactor = (dueDateRating + importanceRating)/2;
                var rawRank = Math.pow(rankingFactor, exponent);
                var processedRank = Math.round(rawRank/bigDiv);

                return processedRank;
            },

            addItem: function(itemName, dueDate, timeTillDueDate, estTime, importanceTxt, urgency, processedRank) {

                items.$add({
                    text: itemName,
                    dueDate: dueDate,
                    secsTillDueDate: timeTillDueDate,
                    estSecsToFinish: estTime,
                    importance: importanceTxt,
                    completed: false,
                    urgent: urgency,
                    rank: processedRank,
                    created_at: Firebase.ServerValue.TIMESTAMP
                });
            }, // end of AddItem

            getAllItems: function() {
                return items;
            }
        }; // end of Return

    } // end of firebase function
]); // end of factory initialization
