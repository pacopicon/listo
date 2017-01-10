listo.factory("FirebaseRef", ["$firebaseArray",
  function($firebaseArray) {

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

// firebase.json
// {
//   "database": {
//     "rules" :"database.rules.json"
//   },
//   "hosting": {
//     "public": "public",
//     "rewrites": [
//       {
//         "source": "**",
//         "destination": "/index.html"
//       }
//     ]
//   }
// }
