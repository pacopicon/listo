(function() {
    function UserCtrl(Items) {
        
    }
    
    angular
        .module('listo', ['ui.router', 'firebase'])
        .controller('UserCtrl', ['ui.router','firebase', 'Items', UserCtrl]);
})();