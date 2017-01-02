listo.factory("dateCruncher", ["ItemCrud",
  function(ItemCrud) {

    var items = ItemCrud.getAllItems();

// Public variables below
    var now = Date.now();
    var week = 604800000;

// in order to display hours and minutes worked for completed items and hours and minutes yet to be worked for incomplete items.
    var clockTime = function(totalHour, totalMin) {
      var totalTime = (totalHour * 60) + totalMin;
      var wholeHoursOnly = Math.floor(totalTime / 60);
      var wholeMinsOnly = totalTime % 60;
      var milliseconds = ((3600000 * wholeHoursOnly) + (60000 * wholeMinsOnly));
      return {
        hours: wholeHoursOnly,
        minutes: wholeMinsOnly,
        milliseconds: milliseconds
      }
    };




    return {

    };

  }
]); // end of factory initialization
