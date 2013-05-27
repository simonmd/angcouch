angular.module('MRParaMetrix.ChartDataFormatter', []).
  filter('chartFormat', function() {
    // console.debug("chartFormat filter invoked");
    return function(results) {
      console.debug("results in filter: %O", results);
      if (!angular.isUndefined(results) && !angular.isUndefined(results.data)) {
        
        var out = [];
        angular.forEach(results.data.rows, function (row) {
          out.push([row.key[3], row.value]);
        });
        return out;
      }
    };
  });