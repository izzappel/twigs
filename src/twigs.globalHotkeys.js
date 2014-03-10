'use strict';

/* twigs
 * Copyright (C) 2014, Hatch Development Team
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @ngdoc service
 * @name twigs.globalHotKeys.service:GlobalHotkeysService
 *
 * @description
 * GlobalHotkeys allows you to assign actions to specific keyboard key combinations.
 * In order for it to work, add the 'twg-global-hotkeys' directive to the top-element of your angular application (e.g. the html-element in a single page application).
 *
 * **Note:** All keypress/keydown events within input fields (input/textarea/select), links and buttons do not trigger the hotkey callback.
 *
 * ### Globally defined hotkeys
 * Globally defined hotkeys are available on all pages (except if explicitly overridden by path-specific hotkeys). You can define them in the **run** function of your Application's main module.
 *
 * ```javascript
 * var App = angular.module('Main',['twigs.globalHotkeys']);
 *
 * App.run(function ($location, GlobalHotkeysService) {
 *
 *    GlobalHotkeysService.registerGlobalHotkeys(["alt+h", "shift+h"], function () {
 *        // go to home view
 *        $location.path('/#');
 *    });
 *
 *
 *    GlobalHotkeysService.registerGlobalHotkeys(["alt+a", "shift+a"], function () {
 *        // do something here
 *    });
 *
 * });
 * ```
 *
 *
 * ### Path-specific hotkeys
 * You can define path-specific hotkeys which can override globally defined hotkeys. These will only be active for the current page.
 *
 * ```javascript
 *
 * App.controller('SomeController', function (GlobalHotkeysService) {
 *
 *    GlobalHotkeysService.registerPageHotkey("alt+i", function () {
 *        // do something here
 *    });
 *
 * });
 *
 * ```
 *
 */
angular.module('twigs.globalHotkeys', [])

    .factory('GlobalHotkeysService', function ($location) {
        var pageHotKeys = {}, globalHotKeys = {};

        function getPageHotKeyAction(page, hotKey) {
            var hotKeys = pageHotKeys[page];
            if (angular.isUndefined(hotKeys)) {
                return undefined;
            }

            return hotKeys[hotKey.toLowerCase()];
        }

        function getGlobalHotkeyAction(hotKey) {
            return globalHotKeys[hotKey.toLowerCase()];
        }

        function registerPageHotKey(hotKey, actionFunction) {
            var page = $location.path();
            var hotKeys = pageHotKeys[page];
            if (angular.isUndefined(hotKeys)) {
                hotKeys = {};
                pageHotKeys[page] = hotKeys;
            }

            hotKeys[hotKey.toLowerCase()] = actionFunction;
        }

        function registerPageHotKeys(hotKeys, actionFunction) {
            angular.forEach(hotKeys, function (key) {
                registerPageHotKey(key, actionFunction);
            });
        }

        function registerGlobalHotkey(hotKey, actionFunction) {
            globalHotKeys[hotKey.toLowerCase()] = actionFunction;
        }

        function registerGlobalHotkeys(hotKeys, actionFunction) {
            angular.forEach(hotKeys, function (key) {
                registerGlobalHotkey(key, actionFunction);
            });
        }

        var serviceInstance = {

            getPageHotKeyAction: getPageHotKeyAction,

            getGlobalHotkeyAction: getGlobalHotkeyAction,

            /**
             * @ngdoc function
             * @name twigs.globalHotKeys.service:GlobalHotkeysService#registerPageHotKey
             * @methodOf twigs.globalHotKeys.service:GlobalHotkeysService
             *
             * @description
             * Controllers can call this function to register a route-/path-specific hotkey.
             *
             * @param {string} hotKey The hotkey as string (e.g.  'n'  or 'alt+n' )
             * @param {function} actionFunction The callback function that is invoked when a hotkey (-combination) is pressed
             */
            registerPageHotKey: registerPageHotKey,

            /**
             * @ngdoc function
             * @name twigs.globalHotKeys.service:GlobalHotkeysService#registerPageHotKeys
             * @methodOf twigs.globalHotKeys.service:GlobalHotkeysService
             *
             * @description
             * Controllers can call this function to register route-/path-specific hotkeys.
             *
             * @param {string[]} hotKey An array of hotkeys where each key is a string (e.g.  'n'  or 'alt+n' )
             * @param {function} actionFunction The callback function that is invoked when a hotkey (-combination) is pressed
             */
            registerPageHotKeys: registerPageHotKeys,

            /**
             * @ngdoc function
             * @name twigs.globalHotKeys.service:GlobalHotkeysService#registerGlobalHotkey
             * @methodOf twigs.globalHotKeys.service:GlobalHotkeysService
             *
             * @description
             * call this function to register a global (application-wide) hotkey.
             *
             * @param {string} The hotkey as string (e.g.  'n'  or 'alt+n' )
             * @param {function} actionFunction The callback function that is invoked when a hotkey (-combination) is pressed
             */
            registerGlobalHotkey: registerGlobalHotkey,

            /**
             * @ngdoc function
             * @name twigs.globalHotKeys.service:GlobalHotkeysService#registerGlobalHotkeys
             * @methodOf twigs.globalHotKeys.service:GlobalHotkeysService
             *
             * @description
             * call this function to register global (application-wide) hotkeys.
             *
             * @param {string[]} hotKey An array of hotkeys where each key is a string (e.g.  'n'  or 'alt+n' )
             * @param {function} actionFunction The callback function that is invoked when a hotkey (-combination) is pressed
             */
            registerGlobalHotkeys: registerGlobalHotkeys
        };

        return serviceInstance;
    })


/**
 * @ngdoc directive
 * @name twigs.globalHotKeys.directive:twgGlobalHotkeys
 * @element ANY
 *
 * @description
 * This directive registers for the 'keypress' event and forwards them to
 * either custom hotkeys for the current page or global hotkey function, if defined.
 *
 * You can use this directive on the _html_ element, in order to catch all key events.
 *
 * Ignores keystrokes in form elements , buttons and links.
 *
 * See [GlobalHotkeysService](#/api/twigs.globalHotKeys.service:GlobalHotkeysService) for more information.
 */
    .directive('twgGlobalHotkeys', function ($location, $rootScope, GlobalHotkeysService) {
        return {
            restrict: 'A',
            link: function (scope, element) {

                function isForbiddenElement(event) {
                    switch (getTarget(event).tagName.toLowerCase()) {
                        case 'a':
                        case 'button':
                        case 'input':
                        case 'select':
                        case 'textarea':
                            return true;
                        default:
                            return false;
                    }
                }

                /*
                 * register to the keypress event (works for most keys, i.e. this is the 'normal' way)
                 */
                element.bind('keypress', function (event) {
                    if (isForbiddenElement(event)) {
                        return;
                    }
                    handleHotKey(event);
                });

                /**
                 * register to keydown to handle 'alt+' in chrome
                 */
                element.bind('keydown', function (event) {
                    if (isForbiddenElement(event)) {
                        return;
                    }
                    if (event.altKey !== true) {
                        return;
                    }
                    handleHotKey(event);
                });

                function handleHotKey(event) {
                    var hotKey = '';
                    if (event.ctrlKey) {
                        hotKey = appendKey(hotKey, 'ctrl');
                    }

                    if (event.altKey) {
                        hotKey = appendKey(hotKey, 'alt');
                    }

                    if (event.shiftKey) {
                        hotKey = appendKey(hotKey, 'shift');
                    }

                    hotKey = appendKey(hotKey, String.fromCharCode(event.which));

                    var pageAction = GlobalHotkeysService.getPageHotKeyAction($location.path(), hotKey);

                    if (angular.isDefined(pageAction)) {
                        pageAction();
                    } else {
                        var globalAction = GlobalHotkeysService.getGlobalHotkeyAction(hotKey);
                        if (angular.isDefined(globalAction)) {
                            globalAction();
                        }
                    }

                    scope.$apply();
                }

                var appendKey = function (oldHotKey, nextKey) {
                    var hotKey = oldHotKey;

                    if (oldHotKey.length > 0) {
                        hotKey += '+';
                    }

                    hotKey += nextKey;

                    return hotKey;
                };

                /**
                 * returns the dom-element that fired the event.
                 * (different browser handling)
                 */
                var getTarget = function (event) {
                    var target;

                    if (!event) {
                        event = window.event;
                    }

                    if (event.target) {
                        target = event.target;
                    } else if (event.srcElement) {
                        target = event.srcElement;
                    }

                    // defeat Safari bug
                    if (target.nodeType === 3) {
                        target = target.parentNode;
                    }

                    return target;
                };
            }
        };
    });