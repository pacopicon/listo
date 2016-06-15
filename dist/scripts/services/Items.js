(function () {
    function Items($firebaseObject, $firebaseArray) {
        
        var ref = new Firebase ("https://listo-1f3db.firebaseio.com");
        
        var items = $firebaseArray(ref);
    };
    
    angular
        .module('listo', ['ui.router', 'firebase'])
        .factory('Items', Items)
})();