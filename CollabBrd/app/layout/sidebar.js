(function () {
    'use strict';

    var controllerId = 'sidebar';
    angular.module('app').controller(controllerId,
        ['$route', 'config', 'routes', 'common', '$location', sidebar]);

    function sidebar($route, config, routes, common, $location) {
        var vm = this;

        vm.isCurrent = isCurrent;

        activate();

        common.auth.fillAuthData();
        vm.user = common.auth.authentication;

        vm.login = function () {
            common.account.login().then(function (data) {
                var success = data.value;
                if (success === true) {
                    common.auth.fillAuthData();
                    vm.user = common.auth.authentication;
                }
                else if (success === 'register') {
                    vm.register();
                }
            })
        }

        vm.logout = function () {
            common.account.logout().then(function (success) {
                if (success === true) {
                    common.auth.fillAuthData();
                    vm.user = common.auth.authentication;
                    $location.path('/');
                }
            })
        }

        vm.register = function () {
            common.account.register().then(function (data) {
                var success = data.value;

                if (success) {
                    common.auth.fillAuthData();
                    vm.user = common.auth.authentication;
                }
            })
        }

        function activate() { getNavRoutes(); }

        function getNavRoutes() {
            vm.navRoutes = routes.filter(function (r) {
                return r.config.settings && r.config.settings.nav;
            }).sort(function (r1, r2) {
                return r1.config.settings.nav - r2.config.settings.nav;
            });
        }

        function isCurrent(route) {
            if (!route.config.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.config.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }
    };
})();
