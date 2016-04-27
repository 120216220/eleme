
var elemeApp = angular.module('eleme', ['ngRoute', 'elemeDirectives', 'elemeCtrl', 'elemeServices']);

elemeApp.run(['$rootScope', '$location', function($rootScope, $location){
	$rootScope.locationpath = $location.path().slice(1).split(/\W+/g);
}]);

elemeApp.config(['$routeProvider',function($routeProvider) {
	$routeProvider.when('/index', {
		templateUrl: 'tpls/main.html',
		controller: 'mainCtrl'
	}).otherwise({
		redirectTo: '/index'
	});
}]);


angular.$ = function(selector){
	selector = angular.isString(selector) ? document.querySelectorAll(selector) : selector;
	return angular.element(selector);
};

angular.element.prototype.find = function(selector){
	if(!selector){
		return angular.$();
	}

	var i,
		allDom = document.querySelectorAll(selector),
		subTag = this[0].getElementsByTagName("*"),
		domArr = [],
		tagArr = [],
		result = [];

	for (i = 0; i < allDom.length; i++) {
		domArr.push(allDom[i]);
	}

	for (i = 0; i < subTag.length; i++) {
		tagArr.push(subTag[i]);
	}

	for (i = 0; i < domArr.length; i++) {
		if(tagArr.indexOf(domArr[i]) !== -1){
			result.push(domArr[i]);
		}
	}

	return angular.$(result);
};

angular.element.prototype.parents = function(selector){
	var i,
		el = this[0],
		result,
		allDom = document.querySelectorAll(selector),
		domArr = [];
	if (!selector) {
		return angualr.$(this[0].parentNode);
	}
	for (i = 0; i < allDom.length; i++) {
		domArr.push(allDom[i]);
	}

	for (;el && "HTML" != el.nodeName;){
		el = el.parentNode;
		if(domArr.indexOf(el) !== -1){
			result = el;
		}
	}

	return angular.$(result);
};