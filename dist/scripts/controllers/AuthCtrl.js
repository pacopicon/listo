listo.controller('AuthCtrl', ["$scope", "ItemCrud", "$rootScope", "$firebaseAuth",
  function($scope, ItemCrud, $rootScope, $firebaseAuth) {

    var ref = ItemCrud.getRef();

    // var ref = new Firebase("https://listo-1f3db.firebaseio.com/");

    var auth = $firebaseAuth(ref);

    // returns promise
    auth.signInWithEmailAndPassword(email, pass);
    // returns promise
    auth.createUserWtihEmailAndPassword(email, pass);

    auth.onAuthStateChanged(firebaseUser );









        //
        //
        // authObj.$createUser({
        //   email: "my@email.com",
        //   password: "mypassword"
        // }).then(function(userData) {
        //   console.log("User " + userData.uid + " created successfully!");
        //
        //   return authObj.$authWithPassword({
        //     email: "my@email.com",
        //     password: "mypassword"
        //   });
        // }).then(function(authData) {
        //   console.log("Logged in as:", authData.uid);
        // }).catch(function(error) {
        //   console.error("Error: ", error);
        // });
        //
        //
        //
        // authObj.$authWithPassword({
        //   email: "my@email.com",
        //   password: "mypassword"
        // }).then(function(authData) {
        //   console.log("Logged in as:", authData.uid);
        // }).catch(function(error) {
        //   console.error("Authentication failed:", error);
        // });
        //
        //
        //
        // authObj.$onAuth(function(authData) {
        //   if (authData) {
        //     console.log("Logged in as:", authData.uid);
        //   } else {
        //     console.log("Logged out");
        //   }
        // });
        //
        //
        //
        // var authData = authObj.$getAuth();
        //
        // if (authData) {
        //   console.log("Logged in as:", authData.uid);
        // } else {
        //   console.log("Logged out");
        // }
        //
















  }
]);
