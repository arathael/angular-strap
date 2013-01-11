
angular.module('$strap.directives')

.directive('bsButton', ['$parse', '$timeout', function($parse, $timeout) {
	'use strict';

	return {
		restrict: 'A',
		require: '?ngModel',
		link: function postLink(scope, element, attrs, controller) {

			// If we have a controller (i.e. ngModelController) then wire it up
			if(controller) {

				// Set as single toggler if not part of a btn-group
				if(!element.parent('[data-toggle="buttons-checkbox"], [data-toggle="buttons-radio"]').length) {
					element.attr('data-toggle', 'button');
				}

				// Handle default state
				if(!!scope.$eval(attrs.ngModel)) {
					element.addClass('active');
				}

				// Watch model for changes
				scope.$watch(attrs.ngModel, function(newValue, oldValue) {
					if(!!newValue === !oldValue) {
						$.fn.button.Constructor.prototype.toggle.call(button);
					}
				});

			}

			// Initialize button
			element.button();

			// Bootstrap override to handle toggling
			var button = element.data('button');
			button.toggle = function() {

				if(!controller) {
					return $.fn.button.Constructor.prototype.toggle.call(this);
				}

				var $parent = element.parent('[data-toggle="buttons-radio"]');

				if($parent.length) {
					element.siblings('[ng-model]').each(function(k, v) {
						$parse($(v).attr('ng-model')).assign(scope, false);
					});
					scope.$digest();
					if(!controller.$modelValue) {
						controller.$setViewValue(!controller.$modelValue);
						scope.$digest();
					}
				} else {
					scope.$apply(function () {
						controller.$setViewValue(!controller.$modelValue);
					});
				}

			};

			// Provide scope display functions
			// scope._button = function(event) {
			// 	element.button(event);
			// };
			// scope.loading = function() {
			// 	element.tooltip('loading');
			// };
			// scope.reset = function() {
			// 	element.tooltip('reset');
			// };

			// if(attrs.loadingText) element.click(function () {
			// 	//var btn = $(this)
			// 	element.button('loading')
			// 	setTimeout(function () {
			// 	element.button('reset')
			// 	}, 1000)
			// });

		}
	};

}])

.directive('bsButtonsCheckbox', ['$parse', function($parse) {
	'use strict';
	return {
		restrict: 'A',
		require: '?ngModel',
		compile: function compile(tElement, tAttrs, transclude) {
			tElement.attr('data-toggle', 'buttons-checkbox').find('a, button').each(function(k, v) {
				$(v).attr('bs-button', '');
			});
		}
	};

}])

.directive('bsButtonsRadio', ['$parse', function($parse) {
	'use strict';
	return {
		restrict: 'A',
		require: '?ngModel',
		compile: function compile(tElement, tAttrs, transclude) {

			tElement.attr('data-toggle', 'buttons-radio');

			// Delegate to children ngModel
			if(!tAttrs.ngModel) {
				tElement.find('a, button').each(function(k, v) {
					$(v).attr('bs-button', '');
				});
			}

			return function postLink(scope, iElement, iAttrs, controller) {

				// If we have a controller (i.e. ngModelController) then wire it up
				if(controller) {

					iElement
						.find('[value]').button()
						.filter('[value="' + scope.$eval(iAttrs.ngModel) + '"]')
						.addClass('active');

					iElement.on('click.button.data-api', function (ev) {
						scope.$apply(function () {
							controller.$setViewValue($(ev.target).attr('value'));
						});
					});

					// Watch model for changes
					scope.$watch(iAttrs.ngModel, function(newValue, oldValue) {
						if(newValue !== oldValue) {
							var $btn = iElement.find('[value="' + scope.$eval(iAttrs.ngModel) + '"]');
							$.fn.button.Constructor.prototype.toggle.call($btn.data('button'));
						}
					});

				}

			};
		}
	};

}]);
