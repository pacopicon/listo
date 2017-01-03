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

    var setFirstDayOfCurrentMonth = function(cellNum) {
      var firstDayOfMonth = now.setDate(1);
      var firstDayObj = new Date(firstDayOfMonth);
      var year = firstDayObj.getFullYear();
      var month = firstDayObj.getMonth();
      var day = firstDayObj.getDay();
      var hours = firstDayObj.getHours();
      var minutes = firstDayObj.getMinutes();
      var seconds = firstDayObj.getSeconds();
      var millis = firstDayObj.getMilliseconds();
      var beginDay = new Date(year, month, 1, 0, 0, 0, 0);
      var beginDayNum = beginDay.getTime();
      var endDay = new Date(year, month, 1, 0, 0, 0, 0);

    }

    var setDayOfCurrentMonth = function (cellNum) {

      if (cellNum < 8) {

      }



      switch (new Date().getDay()) {
        case 0:
            day = "day1";
            break;
        case 1:
            day = "day2";
            break;
        case 2:
            day = "day3";
            break;
        case 3:
            day = "day4";
            break;
        case 4:
            day = "day5";
            break;
        case 5:
            day = "day6";
            break;
        case  6:
            day = "day7";
      }

      if (firstSunday.hasClass(day)) {
        firstSunday.text(firstDayString);
      } else if (firstMonday.hasClass(day)) {
        firstMonday.text(firstDayString);
      } else if (firstTuesday.hasClass(day)) {
        firstTuesday.text(firstDayString);
      } else if (firstWednesday.hasClass(day)) {
        firstWednesday.text(firstDayString);
      } else if (firstThursday.hasClass(day)) {
        firstThursday.text(firstDayString);
      } else if (firstFriday.hasClass(day)) {
        firstFriday.text(firstDayString);
      } else {
        firstSaturday.text(firstDayString);
      }

    };



    return {




    };

  }
]); // end of factory initialization
