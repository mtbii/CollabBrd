(function () {
    'use strict';

    angular
        .module('common')
        .factory('dialog', dialog);

    dialog.$inject = ['ngDialog'];

    function dialog(ngDialog) {
        var service = {
            open: openDialog,
            openConfirm: confirmDialog
        };

        return service;

        function openDialog(options) {
            return ngDialog.open(options);
        }

        function confirmDialog(options) {
            return ngDialog.openConfirm(options);
        }
    }
})();