angular.module('MRParaMetrix.ChartDataFormatter', []).
  filter('chartData', function() {
    return function(resultsjson) {
      rows = resultsjson.data.rows;
      results = [];
      for (var key in rows) {
        results.push([rows[key].key[3], rows[key].value]);
      }
      return results
    };
  });

angular.module('MRParaMetrix', ['CornerCouch', 'MRParaMetrix.ChartDataFormatter']);

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
  	// Final query definition
    qresults = $scope.mrdb.query("test", "TR", {
                                          startkey: [cdbquery.scanner.key,cdbquery.study[1],0],
                                          endkey: [cdbquery.scanner.key,cdbquery.study[1],{}],
                                          group: true,
                                          limit: 10 });

  	$scope.finalquery = qresults;
	};

};