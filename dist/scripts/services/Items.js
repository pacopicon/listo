(function () {
    function Items($rootScope, $firebaseObject,$firebaseArray) {
        
        var ref = new Firebase ("https://listo-1f3db.firebaseio.com");
        
        $scope.data = $firebaseObject(ref);
    };
    
    angular
        .module('listo', ['ui.router', 'firebase'])
        .factory('Items', Items)
})();