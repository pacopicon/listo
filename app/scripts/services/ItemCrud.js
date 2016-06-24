(function () {
    function ItemCrud($rootScope, $firebaseObject, $firebaseArray) {
        
        // downloads data
        var ref = new Firebase("https://listo-1f3db.firebaseio.com/");
        
        // holds items
        var ItemCrud.items = $firebaseArray(ref);
        
        ItemCrud.addItem = function() {
            ItemCrud.items.$add([
                text: ItemCrud.newItemText
            ]);
        };
    };
    
    angular
        .module('listo')
        .factory('ItemCrud', ['$rootScope', 'firebase', ItemCrud]);
})();