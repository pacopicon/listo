listo.filter("parseTime", "$interval",
    function () {
      return function (timeInMillisecs, timeUnit) {
        //   'timeUnit' can be one and only one of these: year, month, //   day, hour, minute, second.
          var millisecsInYear = 12 * 30.4166 * 24 * 60 * 60 * 1000;
          var millisecsInMonth = 30.4166 * 24 * 60 * 60 * 1000;
          var millisecsInDay = 24 * 60 * 60 * 1000;
          var millisecsInHour = 60 * 60 * 1000;
          var millisecsInMinute = 60 * 1000;
          var millisecsInSecs = 1000;

          var years = timeInMillisecs / millisecsInYear;
          var lessThanYear = timeInMillisecs % millisecsInYear;
          var months = lessThanYear / millisecsInMonth;
          var lessThanMonth = lessThanYear % millisecsInMonth;
          var days = lessThanMonth / millisecsInDay;
          var lessThanDay = lessThanMonth % millisecsInDay;
          var hours = lessThanDay / millisecsInHour;
          var lessThanHour = lessThanDay % millisecsInHour;
          var minutes = lessThanHour / millisecsInMinute;
          var lessThanMinute = lessThanHour % millisecsInMinute;
          var seconds = Math.round(lessThanMinute / millisecsInSecs);

          if (timeUnit === 'year') {
              return Math.round(years);
          } else if (timeUnit === 'month') {
              return Math.round(months);
          } else if (timeUnit === 'day') {
              return Math.round(days);
          } else if (timeUnit === 'hour') {
              return Math.round(hours);
          } else if (timeUnit === 'minute') {
              return Math.round(minutes);
          } else if (timeUnit === 'second') {
              return Math.round(seconds);
          }
      };
});
