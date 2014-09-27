(function () {
    'use strict';

    angular
        .module('app')
        .factory('account', account);

    account.$inject = ['dialog', 'logger', '$q', 'authentication'];

    function account(dialog, logger, $q, auth) {

        var logError = logger.getLogFn('account', 'error');

        var service = {
            login: login,
            loginForced: loginForced,
            logout: logout,
            register: register
        };

        return service;

        function loginForced() {
            return dialog.open({
                template: '/app/common/account/dialogs/login-forced-dialog.html',
                controller: 'login'
            }).closePromise
        }

        function login() {
            return dialog.open({
                template: '/app/common/account/dialogs/login-dialog.html',
                controller: 'login'
            }).closePromise
        }

        function register() {
            var defered = $q.defer();

            dialog.open({
                template: '/app/common/account/dialogs/register-dialog.html',
                controller: 'register'
            }).closePromise.then
            (function (data) {
                var creds = data.value.registerVM;
                auth.login({ userName: creds.UserName, password: creds.Password }).then(function (data) {
                    defered.resolve(true);
                });
            }, function (error) {
                logError('An error occured while trying to login.');
                defered.reject(error.value);
            })

            return defered.promise;
        }

        function logout() {
            return dialog.openConfirm({
                template: '/app/common/account/dialogs/logout-dialog.html',
                controller: 'logout'
            })
        }

    }
})();