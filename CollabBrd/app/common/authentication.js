(function () {
    'use strict';

    angular
        .module('app')
        .factory('authentication', authentication);

    authentication.$inject = ['$http', '$q', 'localStorageService', 'routes'];

    function authentication($http, $q, localStorageService, routes) {

        var serviceBase = '/';
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            role: 'Guest',
            userName: ''
        };

        var _saveRegistration = function (registration) {

            _logOut();

            var deferred = $q.defer();

            $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
                deferred.resolve(response);
            },
            function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        var _login = function (loginData) {

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

            var deferred = $q.defer();

            $http.post(serviceBase + 'Token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName });

                _authentication.isAuth = true;
                _authentication.userName = loginData.userName;
                _authentication.role = "Member";

                deferred.resolve(response);

            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };

        var _logOut = function () {

            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.userName = "";
            _authentication.role = "Guest";

        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData && authData.token != 'Guest') {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.role = "Member";
            }

        }

        function _setGuestProfile(profile) {
            _authentication.role = "Guest";
            _authentication.userName = profile.DisplayName;
            localStorageService.set('guestData',
                {
                    Id: profile.Id,
                    DisplayName: profile.DisplayName
                });
        }

        function _getGuestProfile() {
            var authData = localStorageService.get('guestData');

            if (authData) {
                _authentication.userName = authData.DisplayName;
            }

            return authData;
        }


        authServiceFactory.register = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.getGuestProfile = _getGuestProfile;
        authServiceFactory.setGuestProfile = _setGuestProfile;

        return authServiceFactory;
    };
})();

