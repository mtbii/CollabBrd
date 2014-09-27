(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
            r.config.resolve = resolver((r.authentication === undefined || r.authentication === false));
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    function resolver(access) {
        return {
            load: ['$q', 'authentication', 'account', function ($q, auth, account) {
                var deferred = $q.defer();
                if (access) { // fire $routeChangeSuccess
                    deferred.resolve();
                    return deferred.promise;
                }
                else { // fire $routeChangeError
                    if (auth.authentication.isAuth) {
                        deferred.resolve();
                        return deferred.promise;
                    }
                    else {
                        return account.loginForced().then(function (data) {
                            var success = data.value;
                            if (success === true) {
                                deferred.resolve();
                                return deferred.promise;
                            }
                            else {
                                return $q.reject();
                            }
                        },
                        function (error) {
                            return $q.reject();
                        })
                    }
                }
            }]
        }
    }

    // Define the routes 
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: '/app/start/landingPage.html',
                    title: 'start page',
                    settings: {
                        nav: 1,
                        content: '<i></i> Start Page'
                    }
                }
            },
            {
                url: '/dashboard',
                authentication: true,
                config: {
                    templateUrl: '/app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            },
            {
                url: '/projects',
                authentication: true,
                config: {
                    templateUrl: '/app/projects/projects.html',
                    title: 'projects',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-folder"></i> Projects'
                    }
                }
            },
            {
                url: '/projects/:projectId',
                authentication: true,
                config: {
                    templateUrl: 'app/projects/project-detail.html',
                    title: 'project-detail'
                }
            },
            {
                url: '/projects/:projectId/scenes/:sceneId',
                authentication: true,
                config: {
                    templateUrl: 'app/projects/scenes/scene-detail.html',
                    title: 'scene-detail'
                }
            },
            {
                url: '/projects/:projectId/scenes/:sceneId/design',
                authentication: true,
                config: {
                    templateUrl: 'app/projects/scenes/scene.html',
                    title: 'scene-design'
                }
            },
            {
                url: '/admin',
                authentication: true,
                config: {
                    title: 'admin',
                    templateUrl: '/app/admin/admin.html',
                    settings: {
                        nav: 4,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }
        ];
    }
})();