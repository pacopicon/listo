listo.controller('AuthCtrl', ["$scope", "ItemCrud", "UserCrud", "$rootScope", "$interval", "$log", "$http", "$locale", "$location", "$templateCache", "$timeout", "$q", "$sce", "$firebaseAuth",
  function($scope, ItemCrud, UserCrud, $rootScope, $interval, $log, $http, $locale, $location, $templateCache, $timeout, $q, $sce, $firebaseAuth) {

    var ref = ItemCrud.getRef;

    var auth = $firebaseAuth(ref);

    // var user = $firebaseArray(ref);

    // sign in


    promise.catch(e => console.log(e.message));

    $scope.login = function(email, pass) {
      console.log("login called")
      auth.signInWithEmailAndPassword(email, pass).then(function (authData) {
        console.log(AuthData);
      }, function(error) {
        if (error){
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
        }
      });
    };

  }
]);
