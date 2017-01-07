listo.controller('AuthCtrl', ["$scope", "ItemCrud", "UserCrud", "$rootScope", "$interval", "$log", "$http", "$locale", "$location", "$templateCache", "$timeout", "$q", "$sce", "$firebaseAuth",
  function($scope, ItemCrud, UserCrud, $rootScope, $interval, $log, $http, $locale, $location, $templateCache, $timeout, $q, $sce, $firebaseAuth) {

    var ref = ItemCrud.getRef;

    var auth = $firebaseAuth(ref);

    var user = $firebaseArray(ref);

    // sign in

    auth.signInWithEmailAndPassword(email, pass);

    promise.catch(e => console.log(e.message));



    auth.createUserWithEmailAndPassword(email, pass);

    auth.onAuthStateChanged(user, callback); // triggers callback

  }
]);
