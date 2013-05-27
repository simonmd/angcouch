// Load Google Charts package
google.load('visualization', '1', {packages: ['corechart']});

// Begin AngularJS module
angular.module('MRParaMetrix', ['CornerCouch','googlechart.directives']).
  controller("MainCtrl", function ($scope, cornercouch) {

    // Define CouchDB server
    $scope.server = cornercouch();
    // Define CouchDB database to query
    $scope.mrdb = $scope.server.getDB('mf_hash');
    // Scanners query  - the only initial query needed
    $scope.scanners = $scope.mrdb.query("test", "scanners", {
                                        group: true,
                                        descending: true,
                                        limit: 10 });

    // Get studies based on selected scanner          
    $scope.getStudies = function(sel_scanner) {
      console.debug("getting corresponding study list...");
      $scope.studies = $scope.mrdb.query("test", "studies", {
                                        startkey: [sel_scanner.key,0,0],
      												          endkey: [sel_scanner.key,{},{}],
      												          group: true});
      // Clear study model
      $scope.CouchQuery.study = null;
      // Clear series model
      $scope.CouchQuery.series = null;
    };

  	// Get series based on selected scanner and study
    $scope.getSeries = function(sel_scanner,sel_study) {
      console.debug("getting corresponding series list...");
      $scope.series = $scope.mrdb.query("test", "series", {
                                        startkey: [sel_scanner.key,sel_study[1],0],
      						                      endkey: [sel_scanner.key,sel_study[1],{}],
      						                      group: true});
      // Clear series model
      $scope.CouchQuery.series = null;
    };

  	// Submit query
  	$scope.submitQuery = function(CouchQuery) {
      console.debug("submitQuery invoked");

      $scope.CouchQuery.result = $scope.mrdb.list("test", "chart", "TR", {
                                                  startkey: [CouchQuery.scanner.key,CouchQuery.study[1],0],
                                                  endkey: [CouchQuery.scanner.key,CouchQuery.study[1],{}],
                                                  group: true,
                                                  limit: 10 });
      console.debug("$scope.CouchQuery.result in submitquery : %O", $scope.CouchQuery.result);

      // Chart stuff - still not working
      var chart1 = {};
      chart1.type = "ColumnChart";
      chart1.displayed = false;
      chart1.cssStyle = "height:600px; width:100%;";
      chart1.data = $scope.CouchQuery.result;
      chart1.options = {};
      $scope.chart = chart1;
      // End chart stuff

    };
  }
);

