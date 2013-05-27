// Load Google Charts package
google.load('visualization', '1', {packages: ['corechart']});

// Begin AngularJS module
angular.module('MRParaMetrix', ['CornerCouch','ChartFormatFilter','googlechart.directives']).
  controller("CouchCtrl", function ($scope, $filter, cornercouch) {

    // Define CouchDB server
    $scope.server = cornercouch();
    // Define CouchDB database to query
    $scope.mrdb = $scope.server.getDB('mf_hash');
    // Scanners query  - Only initial query needed
    $scope.scanners = $scope.mrdb.query("test", "scanners", { group: true, descending: true, limit: 10 });

  	// Scanner change function
    $scope.scanner_change = function(sel_scanner) {
      console.debug("scanner_change invoked");
      $scope.studies = $scope.mrdb.query("test", "studies", {
      																						startkey: [sel_scanner.key,0,0],
      																						endkey: [sel_scanner.key,{},{}],
      																						group: true});
      // Clear study model
      $scope.cdbquery.study = null;
      // Clear series model
      $scope.cdbquery.series = null;
    };

  	// Study change function
    $scope.study_change = function(sel_scanner,sel_study) {
      console.debug("study_change invoked");
      $scope.series = $scope.mrdb.query("test", "series", {
      																						startkey: [sel_scanner.key,sel_study[1],0],
      																						endkey: [sel_scanner.key,sel_study[1],{}],
      																						group: true});
      // Clear series model
      $scope.cdbquery.series = null;
    };

    // Study change function
    $scope.series_change = function(sel_scanner,sel_study,sel_series) {
      console.debug("series_change invoked");
    };

  	// Submit query
  	$scope.submitquery = function(cdbquery) {
      console.debug("submitquery invoked");
      console.debug("cdbquery in submitquery : %O", cdbquery);

      $scope.results = $scope.mrdb.list("test", "chart", "TR", {
                                            startkey: [cdbquery.scanner.key,cdbquery.study[1],0],
                                            endkey: [cdbquery.scanner.key,cdbquery.study[1],{}],
                                            group: true,
                                            limit: 10 });
      console.debug("$scope.results in submitquery : %O", $scope.results);

      // $scope.chartresults = $filter('uppercase')($scope.results); // WTF!! This works!

    };

      var chart1 = {};
      chart1.type = "ColumnChart";
      chart1.displayed = false;
      chart1.cssStyle = "height:600px; width:100%;";
      chart1.data = $scope.data;

      chart1.options = {};

      $scope.chart = chart1;

  }
);

