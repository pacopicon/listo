listo.factory("ItemCrud", ["$firebaseArray",
    function($firebaseArray) {

    // downloads data
        var ref = new Firebase("https://listo-1f3db.firebaseio.com/");

        // holds items
        var items = $firebaseArray(ref);

        return {
            addItem: function(itemName, date, time, importanceTxt) {
                items.$add({
                    text: itemName,
                    dueDate: date,
                    timeEst: time,
                    importance: importanceTxt,
                    completed: false,
                    urgent: false,
                    // rank: num,
                    created_at: Firebase.ServerValue.TIMESTAMP
                });
            },

            getAllItems: function(){
                return items;
            }
        };

    }
]);
