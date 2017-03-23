listo.factory("FirebaseRef", ["$firebaseArray", "$firebaseObject",
  function($firebaseArray, $firebaseObject) {

// Initialize Firebase
    var config = {
      apiKey: "AIzaSyDJSMDWkPVq7PGxvfB8XRMWlfVNOfmQj9I",
      authDomain: "listo-1f3db.firebaseapp.com",
      databaseURL: "https://listo-1f3db.firebaseio.com",
      storageBucket: "listo-1f3db.appspot.com",
      messagingSenderId: "1095679246609"
    };

    firebase.initializeApp(config);

    var itemsRef = firebase.database().ref().child("items");
    var items = $firebaseArray(itemsRef);

    return {
      getItems: function() {
        return items;
      },

      getItemsRef: function() {
        return itemsRef;
      }

    };

  } // end of FirebaseRef function
]); // end of factory initialization
