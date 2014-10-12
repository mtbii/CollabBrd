(function () {
    'use strict';

    var controllerId = 'sceneDetail'

    angular
        .module('app')
        .controller(controllerId, sceneDetail);

    sceneDetail.$inject = ['$location', '$routeParams', 'datacontext', 'common'];

    function sceneDetail($location, $routeParams, datacontext, common) {
        /* jshint validthis:true */
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = getLogFn(controllerId, 'success');

        var vm = this;
        vm.title = 'Scene Detail';
        vm.sceneId = $routeParams.sceneId;
        vm.projectId = $routeParams.projectId;
        vm.scene = null;

        activate();

        function activate() {
            common.activateController([getScene()], controllerId)
                .then(function () { log('Activated Scene Detail View'); });
        }

        function getScene() {
            return datacontext.scene.getById(vm.sceneId).then(function (data) {
                var results = data;
                common.utils.addProperty(results, { key: 'Selected', value: false });
                return vm.scene = results;
            });
        }
    }
})();
