listo.controller('AdminCtrl', ["$scope", "$firebaseAuth", "FirebaseRef", "UserCrud", "ItemCrud",
  function($scope, $firebaseAuth, FirebaseRef, UserCrud, ItemCrud) {

    // var items = FirebaseRef.getItems();
    //
    // var users = FirebaseRef.getUsers();


    $scope.addUser = function() {
      UserCrud.addItem($scope.newUserName, $scope.newUserEmail, $scope.newUserPass);
    };



  }
]);
