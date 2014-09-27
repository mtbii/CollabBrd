(function () {
    'use strict';

    var controllerId = 'login'

    angular
        .module('app')
        .controller(controllerId, login);

    login.$inject = ['$scope', 'common'];

    function login($scope, common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, 'error');
        var logSuccess = getLogFn(controllerId, 'success');
        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () { });
        }

        $scope.vm = {
            userName: '',
            password: ''
        }

        $scope.loginUser = function () {
            common.auth.login($scope.vm).then(function () {
                logSuccess("Successfully logged in.");
                $scope.closeThisDialog(true);
            },
            function (error) {
                logError('Username or password is incorrect.');
            })
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'logout'

    angular
        .module('app')
        .controller(controllerId, logout);

    logout.$inject = ['$scope', 'common'];

    function logout($scope, common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, 'error');
        var logSuccess = getLogFn(controllerId, 'success');
        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () {
                });
        }

        $scope.logoutUser = function () {
            common.auth.logOut();
            logSuccess("Successfully logged out.");
            this.confirm(true);
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'register'

    angular
        .module('app')
        .controller(controllerId, register);

    register.$inject = ['$scope', 'common'];

    function register($scope, common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, 'error');
        var logSuccess = getLogFn(controllerId, 'success');
        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () { });
        }

        $scope.vm = {
            registerVM: {
                Email: '',
                Password: '',
                ConfirmPassword: ''
            }
        }

        $scope.vm.validation = { messages: [] };

        $scope.registerUser = function () {

            $scope.vm.validation = { messages: [] };

            common.auth.register($scope.vm.registerVM).then(function (response) {
                $scope.closeThisDialog(true)
            },
            function (error) {

                $scope.vm.validation.messages = [];

                if (error.status == 400) {
                    var keys = Object.keys(error.data.ModelState);
                    for (var i = 0; i < keys.length; i++) {
                        var errors = error.data.ModelState[keys[i]];
                        for (var j = 0; j < errors.length; j++) {
                            $scope.vm.validation.messages.push(errors[j]);
                        }
                    }
                }

                //$scope.closeThisDialog(error)
            });
        }
    }
})();