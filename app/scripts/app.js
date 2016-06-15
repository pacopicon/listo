(function () {
    function config($stateProvider, $locationProvider) {
        $locationProvider
            .html5Mode({
                enabled: true,
                requireBase: false
        });
        
        $stateProvider
            .state('landing', {
                url: '/',
                controller: 'LandingCtrl as landing',
                templateUrl: '/templates/landing.html'
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