(function () {
    'use strict';

    var controllerId = 'login'

    angular
        .module('app')
        .controller(controllerId, login);

    login.$inject = ['$scope', 'common', 'spinner'];

    function login($scope, common, spinner) {
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
            spinner.spinnerShow();
            common.auth.login($scope.vm).then(function () {
                spinner.spinnerHide();
                logSuccess("Successfully logged in.");
                $scope.closeThisDialog(true);
            },
            function (error) {
                spinner.spinnerHide();
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
                UserName: '',
                Email: '',
                Password: '',
                ConfirmPassword: ''
            }
        }

        $scope.vm.validation = { messages: [] };

        $scope.registerUser = function () {

            $scope.vm.validation = { messages: [] };

            spinner.spinnerShow();

            common.auth.register($scope.vm.registerVM).then(function (response) {
                spinner.spinnerHide();
                $scope.closeThisDialog($scope.vm)
            },
            function (error) {
                spinner.spinnerHide();
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