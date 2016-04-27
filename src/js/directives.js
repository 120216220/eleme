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