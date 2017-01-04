listo.controller('CalendarCtrl', ["$scope", "ItemCrud", "dateCruncher", "$rootScope", "$interval", "$log", "$http", "$locale", "$location", "$templateCache", '$timeout', "$q", "$sce", "$tooltip",
  function($scope, ItemCrud, dateCruncher, $rootScope, $interval, $log, $http, $locale, $location, $templateCache, $timeout, $q, $sce, $tooltip) {

  

    $scope.items = ItemCrud.getAllItems();





















  }
]);
