var listo = angular.module("listo", ["ui.router", "firebase", "ui.bootstrap", "ngAnimate", "ngSanitize", "mgcrea.ngStrap", "chart.js", "wt.responsive"]);

listo.config(function($stateProvider, $locationProvider, $datepickerProvider, $modalProvider, $popoverProvider) {

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
        .state('navbar', {
            url: '/navbar',
            controller: 'UserCtrl',
            templateUrl: '/templates/navbar.html'
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
        .state('calendar', {
            url: '/calendar',
            controller: 'CalendarCtrl',
            templateUrl: '/templates/calendar.html'
        })
        .state('daily', {
            url: '/daily',
            controller: 'CalendarCtrl',
            templateUrl: '/templates/daily.html'
        })
        .state('weekly', {
            url: '/weekly',
            controller: 'CalendarCtrl',
            templateUrl: '/templates/weekly.html'
        })
        .state('monthly', {
            url: '/monthly',
            controller: 'CalendarCtrl',
            templateUrl: '/templates/monthly.html'
        })
        .state('clock', {
            url: '/clock',
            controller: 'UserCtrl',
            templateUrl: '/templates/clock.html'
        })
        .state('graphs', {
            url: '/graphs',
            controller: 'UserCtrl',
            templateUrl: '/templates/graphs.html'
        })
        .state('pacooverTooltip', {
            url: '/pacooverTooltip',
            controller: 'UserCtrl',
            templateUrl: '/templates/pacooverTooltip.html'
        })
        .state('adminPortal', {
            url: '/adminPortal',
            controller: 'AdminCtrl',
            templateUrl: '/templates/adminPortal.html'
        });

    angular.extend($datepickerProvider.defaults, {
      dateFormat: 'dd/MM/yyyy',
      startWeek: 1
    });

    angular.extend($modalProvider.defaults, {
      html: true
    });

    angular.extend($popoverProvider.defaults, {
      html: true
    });

});

listo.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts

    // '#C3C300' --> yellow,
    // '#6FC853' --> green
    // '#e05d6f' --> red
    // '#3f4e62'--> black
    ChartJsProvider.setOptions({
      chartColors: ['#C3C300', '#6FC853', '#e05d6f', '#3f4e62',  '#AC6D39', '#8E5EC5', '#4c91cd'],
      responsive: true
    });
    // Configure all line charts
    ChartJsProvider.setOptions('line', {
      showLines: true
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
