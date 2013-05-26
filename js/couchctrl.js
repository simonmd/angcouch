angular.module('CouchApp', ['CornerCouch']);

// CouchDB App Controller - uses CornerCouch library
function CouchCtrl($scope, $filter, cornercouch) {
  // Define CouchDB server
  $scope.server = cornercouch();
  // Define CouchDB database to query
  $scope.mrdb = $scope.server.getDB('mf_hash');
  // Scanners query promise
  $scope.scanners = $scope.mrdb.query("test", "scanners", { group: true, descending: true, limit: 8 });
  // Studies query promise
  $scope.studies = $scope.mrdb.query("test", "studies", { group: true, descending: true, limit: 10 });
  // Series query promise
  $scope.series = $scope.mrdb.query("test", "series", { group: true, descending: true, limit: 10 });
	// Pre-define final query url
	$scope.finalquery= {};

	// Query update on filter
	$scope.updatequery = function(cdbquery) {
	// Composite key for query
  	var compkey = [cdbquery.scanner.key,cdbquery.study[1],cdbquery.series[2]];
  	// Final query definition
  	$scope.finalquery = $scope.mrdb.query("test", "TR", {
  																				key: compkey,
  																				group: true,
  																				descending: true,
  																				limit: 10 });
	};

};