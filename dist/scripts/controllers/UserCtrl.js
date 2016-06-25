listo.controller('UserCtrl', function($scope, ItemCrud, $rootScope) {

    $scope.items = ItemCrud.getAllItems();

    $scope.addItem = function() {
        ItemCrud.addItem($scope.newItemName, $scope.newDate, $scope.newTime, $scope.newImportanceTxt);
    };

});
