
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
/**
* elemeDirectives Module
*
* Description
*/
angular.module('elemeDirectives', []).directive('sidebar', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'tpls/sidebar.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
			var backTop = iElm.find(".sidebar-btn-backtop");
			var getScrolltop = function(){
				return Math.max(document.documentElement.scrollTop || 0, document.body.scrollTop || 0);
			};

			var toggleSidebar = function(){
				var el = iElm[0],
					val;
				val = $scope.isSidebarOpen ? "translate3d(0, 0, 0)" : "translate3d(-295px, 0, 0)";
				el.style.webkitTransform = val;
				el.style.msTransform = val;
				el.style.transform = val;
				$scope.isSidebarOpen = !$scope.isSidebarOpen;
			};
			var toggleBacktop = function(){
				backTop.css("visibility", getScrolltop() > 300 ? "visible" : "hidden");
			};
			toggleBacktop();

			$scope.activeTemplate = null;
			$scope.isSidebarOpen = false;
			$scope.toggleSidebar = toggleSidebar;

			angular.$(window).on("scroll", toggleBacktop);
			
			backTop.on("click", function(){
				$("html, body").animate({
					scrollTop: 0
				}, 300);
			});

			iElm.find(".toolbar-open").on("click", function(event){
				var el = angular.$(event.target);
				var category = el.attr("template");
				if (category === $scope.activeTemplate) {
					$scope.activeTemplate = category;
					toggleSidebar();
				}else if($scope.isSidebarOpen){
					$scope.activeTemplate = category;
				}else{
					$scope.activeTemplate = category;
					toggleSidebar();
				}
				$scope.$apply();
			});

			angular.$(document).on("click", function(event){
				if ($scope.isSidebarOpen && !angular.$(event.target).parents(".sidebar").length) {
					toggleSidebar();
					$scope.$apply();
				}
			});
		}
	};
}).directive('carousel', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {}, // {} = isolate, true = child, false/undefined = no change
		controller: ['$scope', '$element', function($scope, $element) {
			var slides = $scope.slides = [];
			var activeNum = 0;
			var timer;
			var ul = $element.find('ul');
			var setTimeRun = function(){
				timer = setTimeout(function(){
					var num = activeNum + 1;
					if (num > slides.length - 1) {
						num = 0;
					}
					$scope.setActiveSlide(num);
					$scope.$digest();
					setTimeRun();
				}, 5000);
			}
			setTimeout(function(){
				setTimeRun();
			}, 0);
			var clearTimer = function(){
				clearTimeout(timer);
				timer = null;
			};
			$element.bind('mouseenter', function(){
				clearTimer();
			});
			$element.bind('mouseleave', function(){
				setTimeRun();
			});

			$scope.setActiveSlide = function(obj){
				angular.forEach(slides, function(e){
					e.active = false;
				});
				var num;
				if ("number" == typeof obj) {
					num = obj;
					obj = slides[num];
					if (obj) {
						obj.active = true;
					}
				}else{
					num = slides.indexOf(obj);
					obj.active = true;
				}
				if (num >= 0 && num < slides.length) {
					activeNum = num;
				}
				var clientH = ul.parent()[0].clientHeight;
				ul.css("top", -1 * activeNum * clientH + 'px');
			};

			this.addSlide = function(obj){
				if (slides.length === 0) {
					$scope.setActiveSlide(obj);
				}
				slides.push(obj);
			};
		}],
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '<div class="carousel-wrapper"><ul class="carousel-list" ng-transclude></ul><ol class="carousel-pager"><li class="page-number" ng-repeat="slide in slides" ng-class="{active: slide.active}" ng-click="setActiveSlide($index)">{{$index + 1}}</li></ol></div>',
		templateUrl: 'tpls/slides/carousel.html',
		replace: true,
		transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		
	};
}).directive('slide', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		require: '^carousel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<li class="carousel-block" ng-transclude></li>',
		// templateUrl: '',
		replace: true,
		transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			controller.addSlide($scope);
		}
	};
}).directive('excavator', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'tpls/excavator/excavator.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			$scope.clickedCategory = -1e4;
			$scope.changeCategory = function(category){
				if ($scope.clickedCategory !== category.id) {
					$scope.clickedCategory = category.id
					if (category.sub_categories && category.sub_categories.length) {
						$scope.subCategories = category.sub_categories;
						$scope.activeCategory = category.id;
					}else if(category.id < 0){
						$scope.subCategories = null;
						$scope.activeCategory = null;
					}
				}
			}
			$scope.option = {};
			$scope.rstStream.orderBy = '';
			$scope.changeOrder = function(e){
				$scope.rstStream.orderBy = e;
				switch(e){
					case "order_lead_time":
						$scope.otherOrder = "配送速度";
						break;
					case "minimum_order_amount":
						$scope.otherOrder = "起送价格";
						break;
					case "distance":
						$scope.otherOrder = "距离最近";
						break;
					default:
						$scope.otherOrder = ""
				}
			};
			
			$scope.rstStream.filter = function(e){
				if($scope.option.mimOrder && e.minimum_order_amount > $scope.option.mimOrder){
					return false;
				}
				return true;
			}
		}
	};
}).directive('rstView', ['templateBuilder', 'templateParser', '$http', function(templateBuilder, templateParser, $http){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<div class="clearfix"></div>',
		// templateUrl: '',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			var tplParser;
			var rstData;
			var rstnum;
			var itemHeight = 140;
			var rownum = 4;
			var flag = false;
			$http.get('tpls/rst-block/rst-block.html').then(function(e){
				var data = e.data;
				tplParser = templateParser.parse(data);
				if (flag) {
					showData();
					flag = false;
				}
			});
			var setViewHeight = function(){
				iElm.css('height', Math.ceil(rstnum / rownum) * itemHeight + "px");
			};
			var build = function(parse, data, num){
				var config = {
					restaurant: data,
					$index: num
				};
				return templateBuilder.build(parse, config);
			};
			var buildData = function(){
				var temp = "";
				if (rstData) {
					for (var i = 0; i < rstData.length; i++) {
						temp += build(tplParser, rstData[i], i);

					};
				}
				return temp;
			};
			var showData = function(e){
				if (!tplParser) {
					return flag = true;
				}
				rstnum = rstData.length;
				setViewHeight();
				iElm.html(buildData());
			};
			$scope.$watchCollection(iAttrs.data, function(e){
				var data = e;
				rstData = e || [];
				showData(data);
			});

		}
	};
}]);
/**
* elemeServices Module
*
* Description
*/
angular.module('elemeServices', ['ngResource']).factory('slideActivities', ['$resource', function($resource){
	return $resource('data/slides.json');
}]).factory('rstStream', ['$resource', function($resource){
	return {
		restaurants: $resource('data/restaurants.json')
	};
}]).factory('filtername', ['$resource', function($resource){
	return $resource('data/category.json');
}]).factory('templateParser', ["$parse", "$interpolate", function(e, t) {
	function r(o) {
		if (1 === o.nodeType) {
			var n, a, s, l, c = [],
				p = {
					tagName: o.tagName.toLowerCase()
				},
				d = o.attributes;
			for (s = 0, l = d.length; l > s; s++) {
				var u = d[s],
					f = u.name,
					g = u.nodeValue;
				if (f && "ng-" === f.substr(0, 3)) if (a || (a = {}), f.length > 8 && "ng-attr-" === f.substr(0, 8)) n || (n = {}), n[f.substr(9)] = e(g);
				else if ("ng-repeat" === f) {
					var h = /(\w+)\s+in(.*?)$/.exec(g);
					h && (a[f] = {
						itemName: h[1],
						getArray: e(h[2])
					})
				} else a[f] = i[f] ? t(g) : e(g);
				else n || (n = {}), /\s*({{\s*(.+?)\s*}})\s*/gi.test(g) ? n[f] = t(g) : n[f] = g
			}
			var m = o.childNodes;
			for (s = 0, l = m.length; l > s; s++) {
				var b = m[s];
				if (3 !== b.nodeType) c.push(r(b));
				else {
					var v = b.nodeValue;
					v && (/\s*({{\s*(.+?)\s*}})\s*/gi.test(v) ? c.push(t(v)) : (v = v.replace(/(\r\n|\n|\r|\s)/gm, ""), v.length && c.push(v)))
				}
			}
			return c.length > 0 && (p.children = c), n && (p.attrs = n), a && (p.dirs = a), p
		}
	}
	var i = {
		"ng-src": !0,
		"ng-href": !0
	};
	return {
		parse: function(e) {
			var t = document.createElement("div");
			return t.innerHTML = e, r(t).children
		}
	}
}]).factory('templateBuilder', function() {
	function e(e) {
		var t = {};
		for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
		return t
	}

	function t(e) {
		var t = function() {};
		return t.prototype = e, new t
	}

	function r(e) {
		var t = "";
		for (var r in e) e.hasOwnProperty(r) && (t += r + ":" + e[r] + ";");
		return t
	}

	function i(e) {
		var t = [];
		for (var r in e) e.hasOwnProperty(r) && e[r] && t.push(r);
		return t.join(" ")
	}

	function o(t) {
		var r = e(t);
		return r.dirs = e(t.dirs), r.dirs["ng-repeat"] = null, delete r.dirs["ng-repeat"], r
	}

	function n(e, c) {
		var p, d, u;
		if (e instanceof Array) {
			for (p = "", d = 0, u = e.length; u > d; d++) p += n(e[d], c);
			return p
		}
		if ("string" == typeof e) return e;
		if ("function" == typeof e) return e(c);
		var f = e.tagName,
			g = e.children,
			h = e.attrs,
			m = e.dirs,
			b = e.textContent,
			v = "",
			x = "";
		if (m && m["ng-repeat"]) {
			var y = o(e),
				k = m["ng-repeat"],
				w = k.getArray(c) || l,
				A = k.itemName;
			for (p = "", d = 0, u = w.length; u > d; d++) {
				var _ = t(c);
				_.$index = d, _.$first = 0 === d, _.$last = d === u - 1, _.$middle = !(_.$first || _.$last), _[A] = w[d], p += n(y, _)
			}
			return p
		}
		p = "<" + f;
		for (var C in m) if (m.hasOwnProperty(C)) {
			var S, I = m[C];
			if ("function" == typeof I && (S = I(c)), "ng-if" === C) {
				if (!S) return ""
			} else a[C] ? p += " " + C.substr(3) + '="' + S + '"' : s[C] ? b = S : "ng-style" === C ? x = r(S) + x : "ng-class" === C ? v += i(S) : ("ng-show" === C || "ng-hide" === C) && S && (v += " " + C)
		}
		for (var M in h) if (h.hasOwnProperty(M)) {
			var E = h[M];
			"function" == typeof E && (E = E(c)), "class" === M ? v += " " + E : p += " " + M + '="' + E + '"'
		}
		if (v && (p += ' class="' + v.trim() + '"'), x && (p += ' style="' + x + '"'), p += ">", b && (p += b), g) for (d = 0, u = g.length; u > d; d++) {
			var T = g[d];
			p += n(T, c)
		}
		return p += "</" + f + ">"
	}
	var a = {
		"ng-src": !0,
		"ng-href": !0,
		"ng-alt": !0,
		"ng-title": !0,
		"ng-id": !0,
		"ng-disabled": !0,
		"ng-value": !0
	},
		s = {
			"ng-html": !0,
			"ng-bind": !0,
			"ng-text": !0
		},
		l = [];
	return {
		build: n
	}
});