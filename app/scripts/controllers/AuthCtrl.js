listo.controller('AuthCtrl', ["$scope", "ItemCrud", "$rootScope", "$firebaseAuth",
  function($scope, ItemCrud, $rootScope, $firebaseAuth) {

    var ref = ItemCrud.getRef();

    // var ref = new Firebase("https://listo-1f3db.firebaseio.com/");

    var auth = $firebaseAuth(ref);


















  }
]);
