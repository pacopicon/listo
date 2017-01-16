listo.controller('ModalController', [
  '$scope', '$element', 'title', 'item', 'close', '$tooltip',
  function($scope, $element, title, item, close, $tooltip) {

    $scope.urgencyTip = {
      "title": "is it urgent?",
      "checked": false
    };


  $scope.name = item.name;
  $scope.updatedDueDate = new Date(item.dueDate);
  $scope.selectedPhrase = item.importance;
  $scope.urgent = item.isUrgent;
  $scope.hours = item.eHour;
  $scope.minutes = item.eMinute;

  $scope.title = title;

  $scope.selectedPhrases = [];
  $scope.phrases = [];
  $scope.phrases = [
    {text:"<i class='fa fa-star'></i>"},
    {text:"<i class='fa fa-star'></i><i class='fa fa-star-half'></i>"},
    {text:"<i class='fa fa-star'></i><i class='fa fa-star'></i>"},
    {text:"<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-half'></i>"},
    {text:"<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i>"}
  ];

  //  This close function doesn't need to use jQuery or bootstrap, because
  //  the button has the 'data-dismiss' attribute.
  $scope.close = function() {

    var newItemProps = {
      newName: $scope.name,
      newDueDate: $scope.updatedDueDate,
      newImportance: $scope.selectedPhrase,
      newUrgent: $scope.urgent,
      newHours: $scope.hours,
      newMinutes: $scope.minutes
    };

 	  close(newItemProps, 500); // close, but give 500ms for bootstrap to animate
    var t = new Date();
    console.log("step 3 - ModalController close: new name: " + newItemProps.newName + ", item date: " + newItemProps.newDueDate + ", Time: " + t.getMinutes() + ":" + t.getSeconds() + ":" + t.getMilliseconds());
  };

  //  This cancel function must use the bootstrap, 'modal' function because
  //  the doesn't have the 'data-dismiss' attribute.
  $scope.cancel = function(item) {

    //  Manually hide the modal.
    $element.modal('hide');

    // var oldItemProps = {
    //   newName: item.name,
    //   newDueDate: new Date(item.dueDate),
    //   newImportance: item.importance,
    //   newUrgent: item.isUrgent,
    //   newHours: item.eHour,
    //   newMinutes: item.eMinute
    // };

    //  Now call close, returning control to the caller.
    // close(oldItemProps, 500); // close, but give 500ms for bootstrap to animate
  };

}]);
