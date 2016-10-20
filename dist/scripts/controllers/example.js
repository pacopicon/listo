// calculateTimeTillUnitsX: function(time) {
//   for (i = 0; i < items.length; i++) {
//     var eachItem = items[i]
//     eachItem.e_currentTime = time;
//
//     if (typeof eachItem.b_dueDate === "object") {
//         eachItem.b_dueDate = eachItem.b_dueDate.getTime();
//     }
//
//     var timeTillDueDate = eachItem.b_dueDate - time;
//
//     var timeTillUnit = parseTimeX(timeTillDueDate);
//
//     eachItem.f_tillDue = timeTillDueDate;
//     eachItem.g_yearsTillDue = timeTillUnit.year;
//     eachItem.h_monthsTillDue = timeTillUnit.month;
//     eachItem.i_daysTillDue = timeTillUnit.day;
//     eachItem.j_hoursTillDue = timeTillUnit.hour;
//     eachItem.k_minutesTillDue = timeTillUnit.minute;
//     eachItem.l_secondsTillDue = timeTillUnit.second;
//
//     eachItem.o_timeToFinishDate = calculateEstTimeAsDateNum(eachItem.m_hoursToFinish, eachItem.n_minutesToFinish);
//
//     var estTime = calculateEstTime(eachItem.m_hoursToFinish, eachItem.n_minutesToFinish);
//     var ratio = calculateTimeEstTimeTillDueRatio(timeTillDueDate, estTime);
//     var urgency = calculateUrgency(ratio);
//     eachItem.r_urgent = createUrgencyTxt(urgency);
//     eachItem.s_rank = calculateRank(eachItem.p_importance, ratio, urgency);
//
//     items.$save(eachItem).then(function() {
//         // console.log(time);
//     });
//   }
// },
