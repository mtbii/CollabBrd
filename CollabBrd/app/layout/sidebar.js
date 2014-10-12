(function () {
    'use strict';

    var controllerId = 'sidebar';
    angular.module('app').controller(controllerId,
        ['config', 'routes', 'common', 'datacontext', '$location', '$route', sidebar]);

    function sidebar(config, routes, common, datacontext, $location, $route) {
        var vm = this;

        vm.isCurrent = isCurrent;

        common.auth.fillAuthData();
        vm.user = common.auth.authentication;

        activate();

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
            var promise = common.account.register();

            promise.then(function (data) {
                var success = data.value;

                if (success) {
                    common.auth.fillAuthData();
                    vm.user = common.auth.authentication;
                }
            }, function (error) {
                console.log(error)
            });
        }

        function activate() {
            getNavRoutes();
            requestGuestAccess();
        }

        function requestGuestAccess() {
            if (!vm.user.isAuth) {
                var guest = common.auth.getGuestProfile();
                if (guest == null) {
                    datacontext.profile.getGuestProfile().then(function (profile) {
                        common.auth.setGuestProfile(profile);
                        vm.user = common.auth.authentication;
                    });
                }
                else {
                    vm.user = common.auth.authentication;
                }
            }
        }

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
