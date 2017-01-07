listo.factory("UserCrud", ["FirebaseRef",
  function(FirebaseRef) {

  // var users = FirebaseRef.getUsers();
  // var usersRef = FirebaseRef.getUsersRef();

  return {

    addUser: function(name, email, pass) {
      var isLoggedIn = false,
      items = {};

      users.$add({
        name: name,
        email: email,
        pass: pass,
        isLoggedIn: isLoggedIn,
        lastLogin: firebase.database.ServerValue.TIMESTAMP,
        items: items
      }).then(function(usersRef) {
        var id = usersRef.key;
        console.log("added item with id " + id);
        users.$indexFor(id);
      });
    },



    updateUser: function(oldUser, newName, newEmail) {

      oldUser.name = newName;
      oldUser.email = newEmail;
      oldUser.pass = newPass;

      users.$save(oldUser).then(function(ref) {
        console.log("users.$save called");
      });
    }

  }


} // end of firebase function
]); // end of factory initialization
