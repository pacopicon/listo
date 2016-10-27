listo.controller("LandingCtrl", function($scope, $rootScope) {
    $scope.hero = {};
    $scope.hero.title = "Organize your life!"




});


// Other notation:

//(function(){
//    function LandingCtrl() {
//       this.heroTitle = "Organize your life!"
//    }
//
//    angular
//        .module('listo')
//        .controller('LandingCtrl', LandingCtrl);
//})();
