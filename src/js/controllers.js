/**
* elemeCtrl Module
*
* Description
*/
angular.module('elemeCtrl', []).controller('sidebarCartCtrl', ['$scope', function($scope){
	
}]).controller('sidebarHistoryCtrl', ['$scope', function($scope){
	
}]).controller('sidebarMessageCtrl', ['$scope', function($scope){
	
}]).controller('mainCtrl', ['$scope', 'slideActivities', 'filtername', 'rstStream', function($scope, slideActivities, filtername, rstStream){
	$scope.rstCategories = filtername.query();
	$scope.rstStream = rstStream;
	$scope.rstStream.restaurants = rstStream.restaurants.query();
	$scope.activities = slideActivities.query();
}]);