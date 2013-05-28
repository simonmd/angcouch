// Load Google Charts package
google.load('visualization', '1', {packages: ['corechart']});

// Begin AngularJS module
angular.module('MRParaMetrix', ['CornerCouch','googlechart.directives']).
  controller("MainCtrl", function ($scope, cornercouch) {

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

    // Chart stuff - still not working
    // var chart1 = {};
    // chart1.type = "ColumnChart";
    // chart1.displayed = false;
    // chart1.cssStyle = "height:600px; width:100%;";
    // chart1.data = {};
    // // chart1.data = $scope.results.chartdata;
    // chart1.options = {};
    // $scope.results.chart = chart1;
    // End chart stuff

  }
);

