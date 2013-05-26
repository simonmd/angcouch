angular.module('CouchApp', ['CornerCouch']);

// CouchDB App Controller - uses CornerCouch library
function CouchCtrl($scope, $filter, cornercouch) {

  // Define CouchDB server
  $scope.server = cornercouch();
  // Define CouchDB database to query
  $scope.mrdb = $scope.server.getDB('mf_hash');
  // Scanners query promise
  $scope.scanners = $scope.mrdb.query("test", "scanners", { group: true, descending: true, limit: 10 });
  // Studies query promise
  $scope.studies = $scope.mrdb.query("test", "studies", { group: true, descending: true, limit: 10 });
  // Series query promise
  $scope.series = $scope.mrdb.query("test", "series", { group: true, descending: true, limit: 10 });

	// Scanner change function
  $scope.scanner_change = function(sel_scanner) {
    $scope.studies = $scope.mrdb.query("test", "studies", {
    																						startkey: [sel_scanner.key,0,0],
    																						endkey: [sel_scanner.key,{},{}],
    																						group: true});
  };

	// Study change function
  $scope.study_change = function(sel_scanner,sel_study) {
    $scope.series = $scope.mrdb.query("test", "series", {
    																						startkey: [sel_scanner.key,sel_study[1],0],
    																						endkey: [sel_scanner.key,sel_study[1],{}],
    																						group: true});
  };

	// Query update on filter
	$scope.updatequery = function(cdbquery) {
		// Composite key for query
		// var compkey = [cdbquery.scanner.key,cdbquery.study[1],cdbquery.series[2]];
		var compkey_start = [cdbquery.scanner.key,cdbquery.study[1],0];
		var compkey_end = [cdbquery.scanner.key,cdbquery.study[1],{}];

		// var compkey = ["IATMR3","RM HIPOFISIS",{}];
  	// Final query definition
  	$scope.finalquery = $scope.mrdb.query("test", "TR", {
  																				startkey: compkey_start,
  																				endkey: compkey_end,
  																				group: true,
  																				limit: 10 });
	};

};