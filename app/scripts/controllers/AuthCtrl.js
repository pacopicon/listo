listo.controller('AuthCtrl', ["$scope", "$state", "ItemCrud", "UserCrud", "$rootScope", "$interval", "$log", "$http", "$locale", "$location", "$templateCache", "$timeout", "$q", "$sce", "$firebaseAuth",
  function($scope, $state, ItemCrud, UserCrud, $rootScope, $interval, $log, $http, $locale, $location, $templateCache, $timeout, $q, $sce, $firebaseAuth) {

    // var ref = ItemCrud.getRef;

    // var a = $firebase.auth();
    var auth = $firebaseAuth();

    // var user = $firebaseArray(ref);

    // var changeState = function('state') {
    //   $state.go('state')
    // };
    //
    // $scope.login = function(email, pass) {
    //   if (email === 'guest@guest.com' && pass === "palmtreerooskee@gmail.com") {
    //     changeState('/userIncompleteItems');
    //   } else {
    //     $window.alert.("wrong e-mail and password");
    //   }
    // };





    // $scope.login = function(email, pass) {
    //   auth.signInWithEmailAndPassword(email, pass).then(function (authData) {
    //     console.log(AuthData);
    //   }, function(error) {
    //     if (error){
    //       var errorCode = error.code;
    //       var errorMessage = error.message;
    //       if (errorCode === 'auth/wrong-password') {
    //         alert('Wrong password.');
    //       } else {
    //         alert(errorMessage);
    //       }
    //     }
    //   });
    // };






  }
]);
