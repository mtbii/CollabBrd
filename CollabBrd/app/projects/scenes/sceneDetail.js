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
        vm.title = 'Project Detail';
        vm.projectId = $routeParams.projectId;
        vm.scenes = [];

        activate();

        function activate() {
            common.activateController([getScenes()], controllerId)
                .then(function () { log('Activated Project Detail View'); });
        }

        function getScenes() {
            return datacontext.scenes.getScenes(vm.projectId).then(function (data) {
                var results = data.results;
                common.utils.addProperty(results, { key: 'Selected', value: false });
                return vm.scenes = results;
            });
        }
    }
})();
