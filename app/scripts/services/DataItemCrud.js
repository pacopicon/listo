listo.factory("DataItemCrud", ["$firebaseArray", "FirebaseRef",
  function($firebaseArray, FirebaseRef) {

// Public variables below
    var dataItemsRef = FirebaseRef.getDataItemsRef();
    var dataItems = FirebaseRef.getDataItems();
    var dataWeekAgoRef = FirebaseRef.getDataWeekAgoRef();
    var dataWeekAgo = FirebaseRef.getDataWeekAgo();
    var dataNextWeekRef = FirebaseRef.getDataNextWeekRef();
    var dataNextWeek = FirebaseRef.getDataNextWeek();

// Public functions below.

// if dataItems array is created for a specific day, 'addOrUpdateDataItems' updates it, otherwise it creates a new one.

    var updateDataItems = function(selectedDataItem, prop1, prop2, prop3, value1, value2, value3) {

      console.log("updateDataItems called");
      console.log("is selectedDataItem defined? " + typeof selectedDataItem);

      if (!(typeof selectedDataItem === "undefined")) {
        selectedDataItem[prop1] += value1;
        selectedDataItem[prop2] += value2;
        selectedDataItem[prop3] += value3;

        // dataItems.$save(selectedDataItem);
        dataItems.$save(selectedDataItem).then(function(selectedDataItem) {
          console.log("prop1 = " + prop1 + ", prop2 = " + prop2 + ", prop3 = " + prop3);
          console.log("saved " + selectedDataItem[prop1] + " as " + value1 + ", " + selectedDataItem[prop2] + " as " + value2 + " and, " + selectedDataItem[prop3] + " as " + value3);
        });

      }

    };

    var createNewDataItems = function(itemDueDate, prop1, prop2, prop3, value1, value2, value3) {

      console.log("createNewDataItems: created new dataItem with dueDate " + itemDueDate + ", and " + prop1 + " as " + value1 + ", " + prop2 + " as " + value2 + " and, " + prop3 + " as " + value3);

      var matchProp = function(propName) {

        if (propName === prop1) {
          return value1;
        } else if (propName === prop2) {
          return value2;
        } else if (propName === prop3) {
          return value3;
        } else {
          return 0;
        }
      };

      var year = itemDueDate.getFullYear();
      var month = itemDueDate.getMonth();
      var date = itemDueDate.getDate();
      var firstMomentObj = new Date(year, month, date, 0, 0, 0, 0);
      var firstMomentNum = firstMomentObj.getTime();
      var firstMomentString = firstMomentObj.toString();
      var lastMomentObj = new Date(year, month, date, 23, 59, 59, 999);
      var lastMomentNum = lastMomentObj.getTime();
      var lastMomentString = lastMomentObj.toString();

      var itemLeftCount = matchProp("itemLeftCount");
      var itemWorkedCount = matchProp("itemWorkedCount");
      var itemOverdueCount = matchProp("itemOverdueCount");
      var itemDueCompleteCount = matchProp("itemDueCompleteCount");

      dataItems.$add({
        a_start: firstMomentString,
        aa_end: lastMomentString,
        beginDay: firstMomentNum,
        endDay: lastMomentNum,
        itemLeftCount: itemLeftCount,
        itemWorkedCount: itemWorkedCount,
        itemOverdueCount: itemOverdueCount,
        itemDueCompleteCount: itemDueCompleteCount,
        hoursLeft: matchProp("hoursLeft"),
        minutesLeft: matchProp("minutesLeft"),
        hoursWorked: matchProp("hoursWorked"),
        minutesWorked: matchProp("minutesWorked"),
        hoursOverdue: matchProp("hoursOverdue"),
        minutesOverdue: matchProp("minutesOverdue"),
        hoursDueComplete: matchProp("hoursDueComplete"),
        minutesDueComplete: matchProp("minutesDueComplete"),
        totalItems: itemLeftCount + itemWorkedCount + itemOverdueCount + itemDueCompleteCount
      });
    };

    var sortDataIntoWeek = function(itemDueDate, prop1, prop2, prop3, value1, value2, value3) {

      var now = new Date();
      var minuteNow = now.getMinutes();
      var hourNow = now.getHours();
      var year = now.getFullYear();
      var month = now.getMonth();
      var dateToday = now.getDate();

      var minuteBeforeNow = function() {
        var minuteBeforeNow = minuteNow - 1;
        if (minuteBeforeNow == 59) {
          var hourBeforeNow = hourNow - 1;
          var minuteBeforeNow = now.setHours(hourBeforeNow);
          return {
            num: minuteBeforeNow,
            obj: new Date(minuteBeforeNow);
          };
        } else {
          var minuteBeforeNow = now.setMinutes(minuteBeforeNow);
          return {
            num: minuteBeforeNow,
            obj: new Date(minuteBeforeNowNum);
          };

        }

      };

      var minuteFromNow - function() {
        var minuteAfterNow = minuteNow + 1;
        if (minuteAfterNow == 0) {
          var hourAfterNow = hourNow + 1;
          var minuteAfterNow = now.setHours(hourAfterNow);
          return {
            num: minuteAfterNow,
            obj: new Date(minuteAfterNow);
          };
        } else {
          var minuteAfterNow = now.setMinutes(minuteAfterNow);
          return {
            num: minuteAfterNow,
            obj: new Date(minuteAfterNowNum);
          };
        }
      };


      var weekAgoDate = dateToday - 7;
      var firstMomentPastWeekObj = new Date(year, month, weekAgoDate, 0, 0, 0, 0);
      var firstMomentPastWeekString = firstMomentPastWeekObj.toString();
      var firstMomentPastWeekNum = firstMomentWeekAgoObj.getTime();
      var lastMomentPastWeekObj = minuteBeforeNow().obj;
      var lastMomentPastWeekString = lastMomentPastWeekObj.toString();
      var lastMomentPastWeekNum = minuteBeforeNow().num;

      var dateWeekFromNow = dateToday + 7;
      var firstMomentNextWeekObj = minuteAfterNow().obj;
      var firstMomentNextWeekString = firstMomentNextWeekObj.toString();
      var firstMomentNextWeekNum = minuteAfterNow().num;
      var lastMomentNextWeekObj = new Date(year, month, dateWeekFromNow, 23, 59, 59, 999);
      var lastMomentNextWeekString = lastMomentNextWeekObj.toString();
      var lastMomentNextWeekNum = lastMomentNextWeekObj.getTime();


      if (itemDueDate >= firstMomentPastWeekNum && itemDueDate < lastMomentPastWeekNum) {

        var whichWeek = dataWeekAgo;

      } else if (itemDueDate >= firstMomentNextWeekNum && itemDueDate < lastMomentPastWeekNum) {

        var whichWeek = dataNextWeek;


      }

      var updateWeeklyData = function(prop1, prop2, prop3, value1, value2, value3) {

      if (whichWeek[prop1] === undefined) {
        whichWeek[prop1] = value1;
      } else {
        whichWeek[prop1] = whichWeek[prop1] + value1;
      }

      if (whichWeek[prop2] === undefined) {
        whichWeek[prop2] = value2;
      } else {
        whichWeek[prop2] = whichWeek[prop2] + value2;
      }

      if (whichWeek[prop3] === undefined) {
        whichWeek[prop3] = value3;
      } else {
        whichWeek[prop3] = whichWeek[prop3] + value3;
      }

      whichWeek.$save();
    };


    return {

      addOrUpdateDataItems: function(itemDueDate, prop1, prop2, prop3, value1, value2, value3) {

        console.log("addOrUpdateDataItems: logged new dataItem with dueDate " + itemDueDate + ", and " + prop1 + " as " + value1 + ", " + prop2 + " as " + value2 + " and, " + prop3 + " as " + value3);

        if (!(typeof dataItems[0] === "undefined")) {
          for (i = 0; i < dataItems.length; i++) {

            var endDay = dataItems[i].endDay;
            var beginDay = dataItems[i].beginDay;

            if (itemDueDate >= beginDay && itemDueDate < endDay) {
              updateDataItems(dataItems[i], prop1, prop2, prop3, value1, value2, value3);
              console.log("SINCE itemDueDate is both >= beginDay AND < endDay, updateDataItems was called");
            } else {
              createNewDataItems(itemDueDate, prop1, prop2, prop3, value1, value2, value3);
              console.log("SINCE itemDueDate is neither >= beginDay NOR < endDay, createNewDataItems was called");
            }

          }
        } else {
          createNewDataItems(itemDueDate, prop1, prop2, prop3, value1, value2, value3);
          console.log("SINCE dataItems[0] is undefined,  createNewDataItems was called to create new dataItem")
        }

      } // end addOrUpdateDataItems

    }; // end of Return

  } // end of ItemCrud function
]); // end of factory initialization
