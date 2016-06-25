listo.controller('UserCtrl', function($scope, ItemCrud, $rootScope) {

    $scope.items = ItemCrud.getAllItems();

    $scope.addItem = function() {
        ItemCrud.addItem($scope.newItemName);
    };

//    $scope.removeItem = function() {
//        ItemCrud.removeItem = function(item)
//    };
});


//(function() {
//    function UserCtrl(ItemCrud) {
//        this.itemCrud = ItemCrud;
//    }
//
//    angular
//        .module('listo')
//        .controller('UserCtrl', ['ItemCrud', 'firebase' UserCtrl]);
//})();
