// Load Google Charts package
google.load('visualization', '1', {packages: ['corechart']});

// Begin AngularJS module, include dependencies
var MRParaMetrix = angular.module('MRParaMetrix', ['CornerCouch','googlechart.directives']);




// First attempt at creating a CouchDB service (factory)
MRParaMetrix.factory('CouchDBService', function (cornercouch) { 
  var server = cornercouch();
  var mrdb = server.getDB('mf_hash');
  var CouchDBService = {

    // Get scanner list
    getScannerList: function () {
      var promise = mrdb.query("main", "scanners", { group: true,descending: true })
                      .then(function (response) {
                        // console.log(response.data);
                        return response.data;
      });
      console.info("Getting scanner list from service");
      return promise;
    },

    // Get study list based on selected scanner
    getStudyList: function (selectedScanner) {
      var sc = selectedScanner.key;
      console.debug("getStudyList invoked with selectedScanner: %O", sc);
      var promise = mrdb.query("main", "studies", {
                                        startkey: [sc,0,0],
                                        endkey: [sc,{},{}],
                                        group: true})
                      .then(function (response) {
                        // console.log(response.data);
                        return response.data;
      });
      console.info("Getting study list from service");
      return promise;
    },

    // Get study list based on selected scanner
    getSeriesList: function (selectedScanner,selectedStudy) {
      var sc = selectedScanner.key;
      var st = selectedStudy[1];
      console.debug("getSeriesList invoked with selectedScanner: %O and selectedStudy: %O", sc, st);
      var promise = mrdb.query("main", "series", {
                                        startkey: [sc,st,0],
                                        endkey: [sc,st,{}],
                                        group: true})
                      .then(function (response) {
                        // console.log(response.data);
                        return response.data;
      });
      console.info("Getting series list from service");
      return promise;
    },

    // Get study list based on selected scanner
    getResults: function (selectedScanner,selectedStudy,selectedSeries) {
      var sc = selectedScanner.key;
      var st = selectedStudy[1];
      var se = selectedSeries[2];
      console.debug("getResults invoked with selectedScanner: %O, selectedStudy: %O and selectedSeries %O", sc, st, se);
      var promise = mrdb.list("parameters", "chart", "TR", {
                                            startkey: [sc,st,se,0],
                                            endkey: [sc,st,se,{}],
                                            group: true})
                      .then(function (response) {
                        // console.log(response.data);
                        return response.data;
      });
      console.info("Getting results for final query from service");
      return promise;
    }

  };

  return CouchDBService;

});





// MR ParaMetrix app main controller
MRParaMetrix.controller('MainCtrl', function($scope, cornercouch, CouchDBService) {
  $scope.couchdb = CouchDBService;

  // // Initialize query parameters and results
  $scope.qParams = {};
  $scope.results = {};

  // Get scanner list - the only initial query needed
  CouchDBService.getScannerList()
    .then(function (sc_list) {
        console.info("Got scanner list from service");
        $scope.couchdb.scannerlist = sc_list;
    });

  // Trigger query for study list
  $scope.$watch('qParams.selectedScanner', function(){
    if (!angular.isUndefined($scope.qParams.selectedScanner)) {
      CouchDBService.getStudyList($scope.qParams.selectedScanner)
      .then(function (st_list) {
          console.info("Got study list from service");
          $scope.couchdb.studylist = st_list;
      });
    }
  });

  // Trigger query for series list
  $scope.$watch('qParams.selectedStudy', function(){
    if (!angular.isUndefined($scope.qParams.selectedScanner) && !angular.isUndefined($scope.qParams.selectedStudy)) {
      CouchDBService.getSeriesList($scope.qParams.selectedScanner,$scope.qParams.selectedStudy)
      .then(function (se_list) {
          console.info("Got series list from service");
          $scope.couchdb.serieslist = se_list;
      });
    }
  });

  // Watch for query parameters change, query for final results
  $scope.$watch('qParams.selectedSeries', function(){
    if (  !angular.isUndefined($scope.qParams.selectedScanner) &&
          !angular.isUndefined($scope.qParams.selectedStudy) && 
          !angular.isUndefined($scope.qParams.selectedSeries)) {
      CouchDBService.getResults($scope.qParams.selectedScanner,$scope.qParams.selectedStudy, $scope.qParams.selectedSeries)
      .then(function (r) {
          console.info("Got results from service");
          $scope.couchdb.results = r;
      });
    }
  });

  // Chart initialization stuff
  var chart1 = {};
      chart1.type = "ColumnChart";
      chart1.displayed = false;
      chart1.cssStyle = "height:600px; width:100%;";
      chart1.data = $scope.couchdb.results;
      $scope.chart = chart1;


  // Trigger chart creation
  $scope.$watch('couchdb.results', function(){
    if (!angular.isUndefined($scope.couchdb.results)) {
      $scope.chart.data = $scope.couchdb.results;
    }
  });
  // End Chart stuff
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
