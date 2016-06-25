listo.factory("ItemCrud", function($firebaseObject, $firebaseArray) {

    // downloads data
    var ref = new Firebase("https://listo-1f3db.firebaseio.com/");

    // holds items
    var items = $firebaseArray(ref);

    return {
        addItem: function(itemName) {
            items.$add({
                text: itemName,
                created_at: Firebase.ServerValue.TIMESTAMP
            });
        },

        getAllItems: function(){
            return items;
        }
    };

//
//    removeItem = function() {
//        for (var i = 0, i < )
//    }

});

//(function () {
//    function ItemCrud($rootScope, $firebaseObject, $firebaseArray) {
//
//        // downloads data
//        var ref = new Firebase("https://listo-1f3db.firebaseio.com/");
//
//        // holds items
//        var ItemCrud.items = $firebaseArray(ref);
//
//        ItemCrud.addItem = function() {
//            ItemCrud.items.$add([
//                text: ItemCrud.newItemText
//            ]);
//        };
//    };
//
//    angular
//        .module('listo')
//        .factory('ItemCrud', ['$rootScope', 'firebase', ItemCrud]);
//})();
