(function () {
    function config($stateProvider, $locationProvider) {
        $locationProvider
            .html5Mode({
                enabled: true,
                requireBase: false
        });
        
        $stateProvider
            .state('login', {
                url: '/',
                controller: 'LoginCtrl as login',
                templateUrl: '/templates/login.html'
            })
            .state('user', {
                url: '/user',
                controller: 'UserCtrl as user',
                templateUrl: '/templates/user.html'
            });
    }
    
    angular
        .module('listo', ['ui.router', 'firebase'])
        .config(config);
})();