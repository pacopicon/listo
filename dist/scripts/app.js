var listo = angular.module("listo", ["ui.router", "firebase", "ui.bootstrap", "ngAnimate", "ngSanitize", "mgcrea.ngStrap", "chart.js"]);

// , "ui.router.tabs"

listo.config(function($stateProvider, $locationProvider, $datepickerProvider, $modalProvider) {

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
        })
        .state('userIncompleteItems', {
            url: '/userIncompleteItems',
            controller: 'UserCtrl',
            templateUrl: '/templates/userIncompleteItems.html'
        })
        .state('userCompleteItems', {
            url: '/userCompleteItems',
            controller: 'UserCtrl',
            templateUrl: '/templates/userCompleteItems.html'
        })
        .state('userWeekly', {
            url: '/userWeekly',
            controller: 'UserCtrl',
            templateUrl: '/templates/userWeekly.html'
        })
        .state('userMonthly', {
            url: '/userMonthly',
            controller: 'UserCtrl',
            templateUrl: '/templates/userMonthly.html'
        })
        .state('userYearly', {
            url: '/userYearly',
            controller: 'UserCtrl',
            templateUrl: '/templates/userYearly.html'
        });

    angular.extend($datepickerProvider.defaults, {
      dateFormat: 'dd/MM/yyyy',
      startWeek: 1
    });

    angular.extend($modalProvider.defaults, {
      html: true
    });
});

listo.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      chartColors: ['#FF5252', '#FF8A80'],
      responsive: false
    });
    // Configure all line charts
    ChartJsProvider.setOptions('line', {
      showLines: false
    });
  }]);

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
