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

// begin firebaseArray:
    var itemsRef = firebase.database().ref().child("items");
    var dataItemsRef = firebase.database().ref().child("dataItems");

    var items = $firebaseArray(itemsRef);
    var dataItems = $firebaseArray(dataItemsRef);
// end firebaseArray

// begin firebaseObject:

   var dataWeekAgoRef = firebase.database().ref("dataWeekAgo");
   var dataNextWeekRef = firebase.database().ref("dataNextWeek");

   var dataWeekAgo = $firebaseObject(dataWeekAgoRef);
   var dataNextWeek = $firebaseObject(dataNextWeekRef);


// end firebaseObject

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
      },

      getDataWeekAgo: function() {
        return dataWeekAgo;
      },

      getDataWeekAgoRef: function() {
        return dataWeekAgoRef;
      },

      getDataNextWeek: function() {
        return dataNextWeek;
      },

      getDataNextWeekRef: function() {
        return dataNextWeekRef;
      },

    };

  } // end of FirebaseRef function
]); // end of factory initialization
