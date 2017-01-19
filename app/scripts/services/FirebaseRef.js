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
    var itemsDataRef = firebase.database().ref().child("itemsData");
    // var itemsDataRef = firebase.database().ref("itemsData");

    var items = $firebaseArray(itemsRef);
    var itemsData = $firebaseArray(itemsDataRef);

    return {
      getItems: function() {
        return items;
      },

      getItemsRef: function() {
        return itemsRef;
      },

      getItemsData: function() {
        return itemsData;
      },

      getItemsDataRef: function() {
        return itemsDataRef;
      }
    };

  } // end of FirebaseRef function
]); // end of factory initialization
