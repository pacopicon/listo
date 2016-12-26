listo.directive('hideHamburger', function ($window) {

  return function (scope, element) {

    var w = angular.element($window);

    scope.getWindowWidth = function () {
      return {
        'w': w.width()
      };
    };

    scope.$watch(scope.getWindowWidth, function (newValue, oldValue) {

      scope.windowWidth = newValue.w;

      // scope.style = function () {
      //
      //   if (newValue.w <= 844) {
      //     return {'display': none};
      //   } else {
      //     return {'display': none};
      //   }
      //
      // };

      scope.style = function () {
        return {
          'width': (newValue.w - 100) + 'px',
          'border': solid
        };
      };

    }, true);

    w.bind('hideHamburger', function () {
      scope.$apply();
    });
  }
})
