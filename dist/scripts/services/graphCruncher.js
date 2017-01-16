listo.factory("graphCruncher", ["ItemCrud",
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
// function below sorts and tallies data for items marked as complete, not complete, overdue and not overdue.  It is called by UserCtrl function '$scope.completionData' when this latter is called when (1) userincompleteItems.html is initialized and (2) when '$scope.markAsComplete', (3) '$scope.markAsIncomplete', (4) '$scope.updateItem', and (5) '$scope.addItem' are called.

      sortAndTally: function (option) {
        var itemWorkedCount = 0;
        var itemLeftCount = 0;
        var itemOverdueCount = 0;
        var itemDueCompleteCount = 0;
        var hoursWorked = 0;
        var minutesWorked = 0;
        var hoursLeft = 0;
        var minutesLeft = 0;
        var hoursOverdue = 0;
        var minutesOverdue = 0;
        var hoursDueComplete = 0;
        var minutesDueComplete = 0;
        var totalItems = items.length;


        for (var i = 0; i < totalItems; i++) {
          // if option = true, then the function only picks out items from the last 7 days.  if option = false, it will pick all items.
          if (option == "lastSeven") {
            var weekBoolean = (items[i].dueDate >= now - week) && (items[i].dueDate <= now);
          } else if (option == "nextSeven"){
            var weekBoolean = (items[i].dueDate <= now + week) && (items[i].dueDate >= now);
          } else {
            var weekBoolean = true;
          }

          if (weekBoolean && items[i].isComplete && !items[i].isPastDue) {
            itemWorkedCount++;
            hoursWorked = hoursWorked + items[i].eHour;
            minutesWorked = minutesWorked + items[i].eMinute;
          } else if (weekBoolean && !items[i].isComplete && !items[i].isPastDue) {
            itemLeftCount++;
            hoursLeft = hoursLeft + items[i].eHour;
            minutesLeft = minutesLeft + items[i].eMinute;
          } else if (weekBoolean && !items[i].isComplete && items[i].isPastDue) {
            itemOverdueCount++;
            hoursOverdue = hoursOverdue + items[i].eHour;
            minutesOverdue = minutesOverdue + items[i].eMinute;
          } else if (weekBoolean && items[i].isComplete && items[i].isPastDue) {
            itemDueCompleteCount++;
            hoursDueComplete = hoursDueComplete + items[i].eHour;
            minutesDueComplete = minutesDueComplete + items[i].eMinute;
          }
        }

        var hoursWorked = clockTime(hoursWorked, minutesWorked).hours;
        var minutesWorked = clockTime(hoursWorked, minutesWorked).minutes;
        var millisecondsWorked = clockTime(hoursWorked, minutesWorked).milliseconds;

        var hoursLeft = clockTime(hoursLeft, minutesLeft).hours;
        var minutesLeft = clockTime(hoursLeft, minutesLeft).minutes;
        var millisecondsLeft = clockTime(hoursLeft, minutesLeft).milliseconds;

        var hoursOverdue = clockTime(hoursOverdue, minutesOverdue).hours;
        var minutesOverdue = clockTime(hoursOverdue, minutesOverdue).minutes;
        var millisecondsOverdue = clockTime(hoursOverdue, minutesOverdue).milliseconds;

        var hoursDueComplete = clockTime(hoursDueComplete, minutesDueComplete).hours;
        var minutesDueComplete = clockTime(hoursDueComplete, minutesDueComplete).minutes;
        var millisecondsDueComplete = clockTime(hoursDueComplete, minutesDueComplete).milliseconds;

        var totalItemCount = itemLeftCount + itemWorkedCount + itemOverdueCount + itemDueCompleteCount;
        var totalCompleteCount = itemWorkedCount + itemDueCompleteCount;
        var totalIncompleteCount = itemLeftCount + itemOverdueCount;
        var totalOverdueCount = itemOverdueCount + itemDueCompleteCount;
        var totalNotOverdueCount = totalItemCount - totalOverdueCount;

        var percentTotalIncomplete = Math.floor(totalIncompleteCount / totalItemCount * 100);
        var percentTotalComplete = Math.floor(totalCompleteCount / totalItemCount * 100);
        var percentTotalOverdue = Math.floor(totalOverdueCount / totalItemCount * 100);
        var percentItemsCompleteOnTime = Math.floor(itemWorkedCount / totalItemCount * 100);
        var percentTotalIncompleteNotOverdue = Math.floor(itemLeftCount / totalItemCount * 100);
        var percentTotalOverdueNotComplete = Math.floor(itemOverdueCount / totalItemCount * 100);
        var percentTotalOverdueComplete = Math.floor(itemDueCompleteCount / totalItemCount * 100);

        return {
          totalItemCount: totalItemCount,
          totalCompleteCount: totalCompleteCount,
          totalIncompleteCount: totalIncompleteCount,
          totalOverdueCount: totalOverdueCount,
          totalNotOverdueCount: totalNotOverdueCount,
          percentTotalIncomplete: percentTotalIncomplete,
          percentTotalComplete: percentTotalComplete,
          percentTotalOverdue: percentTotalOverdue,
          percentItemsCompleteOnTime: percentItemsCompleteOnTime,
          percentTotalIncompleteNotOverdue: percentTotalIncompleteNotOverdue,
          percentTotalOverdueNotComplete: percentTotalOverdueNotComplete,
          percentTotalOverdueComplete: percentTotalOverdueComplete,
          hoursWorked: hoursWorked,
          minutesWorked: minutesWorked,
          millisecondsWorked: millisecondsWorked,
          itemWorkedCount: itemWorkedCount,
          hoursLeft: hoursLeft,
          minutesLeft: minutesLeft,
          millisecondsLeft: millisecondsLeft,
          itemLeftCount: itemLeftCount,
          hoursOverdue: hoursOverdue,
          minutesOverdue: minutesOverdue,
          millisecondsOverdue: millisecondsOverdue,
          itemOverdueCount: itemOverdueCount,
          hoursDueComplete: hoursDueComplete,
          minutesDueComplete: minutesDueComplete,
          millisecondsDueComplete: millisecondsDueComplete,
          itemDueCompleteCount: itemDueCompleteCount
        }
      },
    };

  }
]); // end of factory initialization
