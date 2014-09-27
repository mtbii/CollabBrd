(function () {
    'use strict';

    angular
        .module('app')
        .factory('account', account);

    account.$inject = ['$http', 'dialog'];

    function account($http, dialog) {
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
            return dialog.open({
                template: '/app/common/account/dialogs/register-dialog.html',
                controller: 'register'
            }).closePromise
        }

        function logout() {
            return dialog.openConfirm({
                template: '/app/common/account/dialogs/logout-dialog.html',
                controller: 'logout'
            })
        }

    }
})();