(function () {
    'use strict';

    var controllerId = 'scene';

    angular
        .module('app')
        .controller(controllerId, scene);

    scene.$inject = ['$location', '$routeParams', 'common', 'datacontext'];

    var app = angular.module('app');

    function scene($location, $routeParams, common, datacontext) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = getLogFn(controllerId, 'success');

        var vm = this;
        vm.sceneId = $routeParams.sceneId;
        vm.scene = null;

        activate();

        function activate() {
            common.activateController([getScenes()], controllerId)
                .then(function () { log('Activated Scene View'); });
        }

        function getScenes() {
            return datacontext.scene.getById(vm.sceneId).then(function (data) {
                var results = data;
                return vm.scene = results;
            });
        }
    }
})();
