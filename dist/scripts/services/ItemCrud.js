listo.factory("ItemCrud", ["$firebaseArray",
    function($firebaseArray) {

    // downloads data
        var ref = new Firebase("https://listo-1f3db.firebaseio.com/");

        // holds items
        var items = $firebaseArray(ref);

        return {
            addItem: function(itemName, date, time, hour, minute, importanceTxt, num) {
                items.$add({
                    text: itemName,
                    dueDate: date,
                    dueTime: time,
                    hourEst: hour,
                    minuteEst: minute,
                    importance: importanceTxt,
                    completed: false,
                    urgent: false,
                    rank: num,
                    created_at: Firebase.ServerValue.TIMESTAMP
                });
            },

            getAllItems: function(){
                return items;
            }
        };

    }
]);
