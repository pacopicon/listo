listo.controller('UserCtrl', function($scope, ItemCrud, $rootScope) {

    $scope.items = ItemCrud.getAllItems();

    $scope.addItem = function() {
        ItemCrud.addItem($scope.newItemName, $scope.newDate, $scope.newTime, $scope.newImportanceTxt);
    };

    $scope.newImportanceTxt = {
        repeatSelect: null,
        availableOptions: [
            {id: '1', text: 'not important at all'},
            {id: '2', text: 'somewhat important'},
            {id: '3', text: 'important'},
            {id: '4', text: 'pretty important'},
            {id: '5', text: 'job depends on it'}
        ]
  };

});
