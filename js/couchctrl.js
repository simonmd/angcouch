// Load Google Charts package
google.load('visualization', '1', {packages: ['corechart']});

// Begin AngularJS module
angular.module('MRParaMetrix', ['CornerCouch','googlechart.directives']).
  controller("MainCtrl", function ($scope, cornercouch) {

    // Define CouchDB server
    $scope.server = cornercouch();
    // Define CouchDB database to query
    $scope.mrdb = $scope.server.getDB('mf_hash');

    // Get scanner list - the only initial query needed
    $scope.scannerList = $scope.mrdb.query("test", "scanners", { group: true,descending: true });
    // $scope.selectedScanner = $scope.scannerList[0];

    $scope.$watch('selectedScanner', function(){
      if (!angular.isUndefined($scope.selectedScanner)) {
        var sc = $scope.selectedScanner.key;
        console.debug("getting corresponding study list...");
        $scope.studyList = $scope.mrdb.query("test", "studies", {
                                          startkey: [sc,0,0],
                                          endkey: [sc,{},{}],
                                          group: true});
      }
    });

    $scope.$watch('selectedStudy', function(){
      if (!angular.isUndefined($scope.selectedScanner) && !angular.isUndefined($scope.selectedStudy)) {
        var sc = $scope.selectedScanner.key;
        var st = $scope.selectedStudy[1];
        console.debug("getting corresponding series list...");
        $scope.seriesList = $scope.mrdb.query("test", "series", {
                                startkey: [sc,st,0],
                                endkey: [sc,st,{}],
                                group: true});
      }
    });

    $scope.$watch('selectedSeries', function(){
      if (  !angular.isUndefined($scope.selectedScanner) &&
            !angular.isUndefined($scope.selectedStudy) && 
            !angular.isUndefined($scope.selectedSeries)) {
        var sc = $scope.selectedScanner.key;
        var st = $scope.selectedStudy[1];
        var ss = $scope.selectedSeries[2];
        console.debug("getting results...");
        $scope.results = $scope.mrdb.list("test", "chart", "TR", {
                                              startkey: [sc,st,ss,0],
                                              endkey: [sc,st,ss,{}],
                                              group: true});
      }
    });

    	// // Submit query
     //  $scope.CouchQuery.result = $scope.mrdb.list("test", "chart", "TR", {
     //                                              startkey: [CouchQuery.scanner.key,CouchQuery.study[1],0],
     //                                              endkey: [CouchQuery.scanner.key,CouchQuery.study[1],{}],
     //                                              group: true,
     //                                              limit: 10 });

      // // Chart stuff - still not working
      // var chart1 = {};
      // chart1.type = "ColumnChart";
      // chart1.displayed = false;
      // chart1.cssStyle = "height:600px; width:100%;";
      // chart1.data = $scope.CouchQuery.result;
      // chart1.options = {};
      // $scope.chart = chart1;
      // // End chart stuff
  }
);

