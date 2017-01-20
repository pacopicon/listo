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
    var dataItemsRef = firebase.database().ref().child("dataItems");
    // var dataItemsRef = firebase.database().ref("dataItems");

    var items = $firebaseArray(itemsRef);
    var dataItems = $firebaseArray(dataItemsRef);

    return {
      getItems: function() {
        return items;
      },

      getItemsRef: function() {
        return itemsRef;
      },

      getDataItems: function() {
        return dataItems;
      },

      getDataItemsRef: function() {
        return dataItemsRef;
      }
    };

  } // end of FirebaseRef function
]); // end of factory initialization
