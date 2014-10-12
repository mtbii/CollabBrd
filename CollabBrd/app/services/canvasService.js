(function () {
    'use strict';

    angular
        .module('app')
        .factory('canvasService', canvasService);

    canvasService.$inject = ['datacontext', '$http'];

    function canvasService(datacontext, $http) {
        var service = {
            sync: syncWithServer
        };

        return service;

        function syncWithServer() { }
    }
})();