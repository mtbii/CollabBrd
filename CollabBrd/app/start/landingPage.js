(function () {
    'use strict';
    var controllerId = 'landingPage';
    angular.module('app').controller(controllerId, ['common', landingPage]);

    function landingPage(common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Quick Start';

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () { log('Activated Quick Start View'); });
        }
    }
})();