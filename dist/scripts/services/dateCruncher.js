listo.factory("dateCruncher", ["ItemCrud",
  function(ItemCrud) {

    var items = ItemCrud.getAllItems();

// Public variables below

    var week = 604800000;

// in order to display hours and minutes worked for completed items and hours and minutes yet to be worked for incomplete items.

    var now = Date.now();

    var nowObj = new Date(now);

    var nDaysFromXpointInTime = function (numDays, pointInTime) {
      // pointInTime should either be a Date object or a number representing a Date in milliseconds.
      // n is an integer representing n 24-hour periods
      if (typeof pointInTime == "object") {
        var pointInTime = pointInTime.getTime();
      }
      return (pointInTime + 86400000) * numDays;
    };

    var nMonthsFromXpointInTime = function (numMonths, pointInTime) {
      // n is an integer representing n 24-hour periods
      if (typeof pointInTime == "number") {
        var pointInTime = new Date(pointInTime);
      }
      var newDateNum = pointInTime.setMonth(numMonths);
      return newDateNum;
    };

    var nYearsFromXpointInTime = function (numYears, pointInTime) {
      // n is an integer representing n 24-hour periods
      if (typeof pointInTime == "number") {
        var pointInTime = new Date(pointInTime);
      }
      var yearMultiple = 12 * numYears
      var newDateNum = pointInTime.setMonth(yearMultiple);
      return newDateNum;
    };

    var setDay = function(cellNum) {
      var dayObj = new Date();
      var year = dayObj.getFullYear();
      var month = dayObj.getMonth();
      var day = dayObj.getDay();
      var hours = dayObj.getHours();
      var minutes = dayObj.getMinutes();
      var seconds = dayObj.getSeconds();
      var millis = dayObj.getMilliseconds();
      var beginDay = new Date(year, month, 1, 0, 0, 0, 0);
      var beginDayNum = beginDay.getTime();
      var endDay = new Date(year, month, 1, 23, 59, 59, 999);

      return {
        beginDay: beginDay,
        endDay: endDay
      };
    };





    return {




    };

  }
]); // end of factory initialization
