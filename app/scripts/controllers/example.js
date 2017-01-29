// db {
//   users: {
//     {userID: 123, tasks: {}}, {userID: 124, tasks: {}}
//   }
// }

// updateAllItemsPastDue: function() {
//   var totalItems = items.length;
//
//   for (var i = 0; i < totalItems; i++) {
//
//     var dueDate = items[i].dueDate;
//
//     if (!items[i].isComplete) {
//
//       var item = items[i];
//
//       if (items[i].dueDate < now && !items[i].isPastDue) {
//
//         items[i].isPastDue = true;
//         var valArray = [1, item.eHour, item.eMinute];
//
//       } else if (items[i].dueDate > now && items[i].isPastDue) {
//
//         items[i].isPastDue = false;
//         var hourNeg = items[i].eHour * -1;
//         var minuteNeg = items[i].eMinute * -1;
//         var valArray = [-1, hourNeg, minuteNeg];
//
//       }
//
//       (function () {
//         items.$save(items[i]);
//
//         var data = {
//           valArray: valArray,
//           item: item
//         };
//
//         return data;
// 
//       })().then(function(data) {
//         var valArray = data.valArray;
//         var item = data.item;
//
//         var propArray = ["itemOverdueCount", "hoursOverdue", "minutesOverdue"];
//         var owner = "updateAllItemsPastDue";
//         addOrUpdateDataItems(owner, item.dueDate, propArray, valArray);
//
//       });
//
//     }
//   }
// },
