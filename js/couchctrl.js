// Load Google Charts package
google.load('visualization', '1', {packages: ['corechart']});

// Begin AngularJS module, include dependencies
var MRParaMetrix = angular.module('MRParaMetrix', ['CornerCouch','googlechart.directives']);

// First attempt at creating a CouchDB service
myApp.factory('CouchDBService', function (cornercouch) {

    var CouchDBService = {
        // Define CouchDB server
        var server = cornercouch();
        // Define CouchDB database to query
        var mrdb = $scope.server.getDB('mf_hash');

        getScannerList: function () {           
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get("avengers.json")
                .then(function (response) {
                  // localStorageService.add('AvengersService', angular.toJson(response.data));
                  //console.log(response.data);
                  // The then function here is an opportunity to modify the response
                  // The return value gets picked up by the then in the controller.
                  // return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };

    return CouchDBService;
});


// MR ParaMetrix app main controller
MRParaMetrix.controller('MainCtrl', function($scope, cornercouch, CouchDBService) {

  // Define CouchDB server
  $scope.server = cornercouch();
  // Define CouchDB database to query
  $scope.mrdb = $scope.server.getDB('mf_hash');

  // Initialize stuff
  $scope.qParams = {};
  $scope.sLists = {};
  $scope.results = {};

  // Get scanner list - the only initial query needed
  $scope.sLists.scannerList = $scope.mrdb.query("test", "scanners", { group: true,descending: true });

  // Trigger query for study list
  $scope.$watch('qParams.selectedScanner', function(){
    if (!angular.isUndefined($scope.qParams.selectedScanner)) {
      var sc = $scope.qParams.selectedScanner.key;
      console.debug("getting corresponding study list...");
      $scope.sLists.studyList = $scope.mrdb.query("test", "studies", {
                                        startkey: [sc,0,0],
                                        endkey: [sc,{},{}],
                                        group: true});
    }
  });

  // Trigger query for seeries list
  $scope.$watch('qParams.selectedStudy', function(){
    if (!angular.isUndefined($scope.qParams.selectedScanner) && !angular.isUndefined($scope.qParams.selectedStudy)) {
      var sc = $scope.qParams.selectedScanner.key;
      var st = $scope.qParams.selectedStudy[1];
      console.debug("getting corresponding series list...");
      $scope.sLists.seriesList = $scope.mrdb.query("test", "series", {
                              startkey: [sc,st,0],
                              endkey: [sc,st,{}],
                              group: true});
    }
  });

  // Watch for selected series change, query for final results
  $scope.$watch('qParams.selectedSeries', function(){
    if (  !angular.isUndefined($scope.qParams.selectedScanner) &&
          !angular.isUndefined($scope.qParams.selectedStudy) && 
          !angular.isUndefined($scope.qParams.selectedSeries)) {
      var sc = $scope.qParams.selectedScanner.key;
      var st = $scope.qParams.selectedStudy[1];
      var ss = $scope.qParams.selectedSeries[2];
      console.debug("getting results...");
      $scope.results.chartdata = $scope.mrdb.list("test", "chart", "TR", {
                                            startkey: [sc,st,ss,0],
                                            endkey: [sc,st,ss,{}],
                                            group: true});
    }
    console.debug("$scope.results.chartdata in watch: %O", $scope.results.chartdata);
  });

  // Chart initialization stuff
  $scope.chart = {};
  $scope.chart.type = "ColumnChart";
  $scope.chart.displayed = false;
  $scope.chart.cssStyle = "height:600px; width:100%;";
  $scope.chart.options = {};
  $scope.chart.data = $scope.results.chartdata;
  // $scope.chart.data = { "cols": [
  //                       {id: "col1", label: "Test col 1 - key", type: "string"},
  //                       {id: "col2", label: "Test col 2 - value", type: "number"}
  //                       ], 
  //                       "rows": [
  //                       {c: [ {v: "January"}, {v: 19} ]},
  //                       {c: [ {v: "February"},{v: 13} ]},
  //                       {c: [ {v: "March"}, {v: 24} ]}
  //                     ]};
 } 
);
