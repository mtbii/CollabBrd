(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions

        // 3rd Party Modules
        'ui.bootstrap',      // ui-bootstrap (ex: carousel, pagination, dialog)
        'ngDialog',
        'LocalStorageModule',
        'breeze.angular',    // configures breeze for an angular app
        'breeze.directives' // contains the breeze validation directive (zValidate)
    ]);

    app.config(['ngDialogProvider', '$httpProvider', function (ngDialogProvider, $httpProvider) {
        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-default',
            showClose: true,
            closeByDocument: true,
            closeByEscape: true
        });

        $httpProvider.interceptors.push('authInterceptor');
    }]);

    // Handle routing errors and success events
    app.run(['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
        // Include $route to kick start the router.
        //breeze.config.extendQ($rootScope, $q);
    }]);
})();