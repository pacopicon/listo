listo.controller('ModalController', [
  '$scope', '$element', 'title', 'item', 'close',
  function($scope, $element, title, item, close) {

  $scope.name = item.a_text;
  $scope.updatedDueDate = new Date(item.b_dueDate);
  $scope.importance = item.p_importance;
  $scope.urgent = item.r_urgent;
  $scope.hours = item.m_hoursToFinish;
  $scope.minutes = item.n_minutesToFinish;



  $scope.title = title;

  $scope.selectedPhrase = "";
  $scope.selectedPhrases = [];
  $scope.phrases = [
    {text:"not important at all"},
    {text:"somewhat important"},
    {text:"important"},
    {text:"pretty important"},
    {text:"job depends on it"}
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
  $scope.cancel = function() {

    //  Manually hide the modal.
    $element.modal('hide');

    var oldItemProps = {
      oldName: item.a_text,
      oldDueDate: new Date(item.b_dueDate),
      oldImportance: item.p_importance,
      oldUrgent: item.r_urgent,
      oldHours: item.m_hoursToFinish,
      oldMinutes: item.n_minutesToFinish
    };

    //  Now call close, returning control to the caller.
    close(oldItemProps, 500); // close, but give 500ms for bootstrap to animate
  };

}]);
