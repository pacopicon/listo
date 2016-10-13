var listo = angular.module("listo", ["ui.router", "firebase", "ui.bootstrap", "ngAnimate", "ngSanitize", "mgcrea.ngStrap"]);

listo.config(function($stateProvider, $locationProvider, $datepickerProvider) {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $stateProvider
        .state('landing', {
            url: '/',
            controller: 'LandingCtrl',
            templateUrl: '/templates/landing.html'
        })
        .state('user', {
            url: '/user',
            controller: 'UserCtrl',
            templateUrl: '/templates/user.html'
        });

    angular.extend($datepickerProvider.defaults, {
      dateFormat: 'dd/MM/yyyy',
      startWeek: 1
    });
});

//(function () {
//    function config($stateProvider, $locationProvider, $urlRouterProvider) {
//        $locationProvider
//            .html5Mode({
//                enabled: true,
//                requireBase: false
//        });
//
//        $stateProvider
//            .state('landing', {
//                url: '/',
//                controller: 'LandingCtrl as landing',
//                templateUrl: '/templates/landing.html'
//            })
//            .state('user', {
//                url: '/user',
//                controller: 'UserCtrl as user',
//                templateUrl: '/templates/user.html'
//            });
//    }
//
//    angular
//        .module('listo', ['ui.router', 'firebase'])
//        .config(config);
//})();
