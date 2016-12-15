listo.controller('ModalController', [
  '$scope', '$element', 'title', 'close',
  function($scope, $element, title, close) {

  $scope.name = null;
  $scope.updatedDueDate = new Date();
  $scope.newHourEst = 0;
  $scope.newMinuteEst = 0;

  $scope.newImportanceTxt = {
    repeatSelect: "important",
    availableOptions: [
      {id: '1', text: "not important at all"},
      {id: '2', text: "somewhat important"},
      {id: '3', text: "important"},
      {id: '4', text: "pretty important"},
      {id: '5', text: "job depends on it"}
    ]
  };

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
 	  close({
      a_text: $scope.name,
      b_dueDate: $scope.updatedDueDate,
      p_importance: $scope.importance,
      r_urgent: $scope.urgent,
      m_hoursToFinish: $scope.hours,
      n_minutesToFinish: $scope.minutes
    }, 500); // close, but give 500ms for bootstrap to animate
  };

  //  This cancel function must use the bootstrap, 'modal' function because
  //  the doesn't have the 'data-dismiss' attribute.
  $scope.cancel = function() {

    //  Manually hide the modal.
    $element.modal('hide');

    //  Now call close, returning control to the caller.
    close({
      a_text: $scope.name,
      b_dueDate: $scope.updatedDueDate,
      p_importance: $scope.importance,
      r_urgent: $scope.urgent,
      m_hoursToFinish: $scope.hours,
      n_minutesToFinish: $scope.minutes
    }, 500); // close, but give 500ms for bootstrap to animate
  };

}]);
