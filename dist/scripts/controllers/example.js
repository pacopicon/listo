


<div ng-controller="OptionsModalCtrl">
  <script type="text/ng-template" id="optionsModal.html">
    <div class="modal-header">
      <h3 class="modal-title" id="modal-title">Im a modal!</h3>
    </div>
    <div class="modal-body" id="modal-body">

      <label>Format: <span class="muted-text">(manual alternate <em>{{options.altInputFormats[0]}}</em>)</span></label>
      <select class="form-control formBox" ng-model="format" ng-options="f for f in options.formats"><option></option></select>
      <button type="button" class="btn btn-sm btn-default" ng-click="options.toggleMin()" uib-tooltip="After today restriction">Min date</button>
      <button type="button" class="btn btn-sm btn-default" ng-click="options.toggleWeekendDisable()" uib-tooltip="weekend restriction">restrict weekends</button>
      Hours step is:
      <select class="form-control numberFormBox" ng-model="hstep" ng-options="opt for opt in options.options.hstep"></select>
      Minutes step is:
      <select class="form-control numberFormBox" ng-model="mstep" ng-options="opt for opt in options.options.mstep"></select>
      <button type="button" class="btn btn-info" ng-click="options.toggleMode()">12H / 24H</button>


    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" type="button" ng-click="ok()">OK</button>
      <button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>
    </div>
  </script>
  <button type="button" class="btn btn-default" ng-click="open()">Open me!</button>
  <button type="button" class="btn btn-default" ng-click="open('lg')">Large modal</button>
  <button type="button" class="btn btn-default" ng-click="open('sm')">Small modal</button>
  <button type="button" class="btn btn-default" ng-click="toggleAnimation()">Toggle Animation ({{ $scope.animationsEnabled }})</button>
  <button type="button" class="btn btn-default" ng-click="openComponentModal()">Open a component modal!</button>
</div> -->
