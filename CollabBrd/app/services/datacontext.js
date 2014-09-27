(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId, ['common', 'config', 'entityManagerFactory', 'repositories', datacontext]);

    function datacontext(common, config, emFactory, repositories) {
        var $q = common.$q;
        var manager = emFactory.newManager();
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var repoNames = ['project', 'scene'];

        var service = {
            //Repositories to be added on demand
            // Projects
            // Scenes
            getMessageCount: getMessageCount,
            getPeople: getPeople,
            save: save,
            cancel: cancel
        };

        init();

        return service;

        function save() {
            return manager.saveChanges()
            .then(saveSucceeded, saveFailed);

            function saveSucceeded(result) {
                logSuccess('Saved data', result, true);
            }

            function saveFailed(error) {
                var msg = config.appErrorPrefix + 'Save failed: ' +
                    breeze.saveErrorMessageService.getErrorMessage(error);
                error.message = msg;
                logError(msg, error);
                throw error;
            }
        }

        function cancel() {
            manager.rejectChanges();
            logSuccess('Canceled changes', null, true);
        }

        function getMessageCount() { return $q.when(72); }

        function getPeople() {
            var people = [
                { firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida' },
                { firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California' },
                { firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York' },
                { firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota' },
                { firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota' },
                { firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina' },
                { firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming' }
            ];
            return $q.when(people);
        }

        function extendMetadata() {
            var metadataStore = manager.metadataStore;
            var types = metadataStore.getEntityTypes();

            types.forEach(function (type) {
                if (type instanceof breeze.EntityType) {
                    set(type.shortName, type);
                }
            });



            function set(resourceName, entityName) {
                metadataStore.setEntityTypeForResourceName(resourceName, entityName);
            }
        }

        function getProjects() {
            //var projects = [
            //    //{ Id: 0, Name: 'Project 1', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
            //    //{ Id: 1, Name: 'Project 2', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
            //    //{ Id: 2, Name: 'Project 3', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
            //    //{ Id: 3, Name: 'Project 4', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
            //];

            var query = breeze.EntityQuery
            .from('Projects')
            .orderBy('CreateDate');

            return manager.executeQuery(query);
        }

        function getUserProjects() {
            var query = breeze.EntityQuery
            .from('UserProjects')
            .orderBy('CreateDate');

            return manager.executeQuery(query);
        }

        function getScene() {

        }

        function getScenes() {
            //var scenes = [
            //    { Id: 0, Name: 'Scene 1', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
            //    { Id: 1, Name: 'Scene 2', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
            //    { Id: 2, Name: 'Scene 3', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
            //    { Id: 3, Name: 'Scene 4', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
            //];

            //return $q.when(scenes);

            var query = breeze.EntityQuery
            .from('Scenes')
            .orderBy('CreateDate');

            return manager.executeQuery(query);
        }

        function init() {
            repositories.init(manager);
            extendMetadata();
            defineLazyLoadedRepos();
        }

        function defineLazyLoadedRepos() {
            repoNames.forEach(function (name) {
                Object.defineProperty(service, name, {
                    configurable: true,
                    get: function () {
                        var repo = repositories.getRepo(name);

                        Object.defineProperty(service, name, {
                            value: repo,
                            configurable: false,
                            enumerable: true
                        });

                        return repo;
                    }
                })
            })
        }
    }
})();