(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId, ['common', 'entityManagerFactory', datacontext]);

    function datacontext(common, emFactory) {
        var $q = common.$q;
        var manager = emFactory.newManager();

        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount,

            user: {
                getUserProjects: getUserProjects
            },

            account: {
                login: login,
                logout: logout
            },

            projects: {
                getProjects: getProjects
            },

            scenes: {
                getScenes: getScenes
            }
        };

        return service;

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

        function getProjects() {
            var projects = [
                //{ Id: 0, Name: 'Project 1', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
                //{ Id: 1, Name: 'Project 2', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
                //{ Id: 2, Name: 'Project 3', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
                //{ Id: 3, Name: 'Project 4', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
            ];

            var query = breeze.EntityQuery
            .from('Projects')
            .orderBy('CreateDate');

            return manager.executeQuery(query);
        }

        function getUserProjects() {
            var projects = [];

            return $q.when(projects);
        }

        function getScene() {

        }

        function getScenes() {
            var scenes = [
                { Id: 0, Name: 'Scene 1', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
                { Id: 1, Name: 'Scene 2', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
                { Id: 2, Name: 'Scene 3', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
                { Id: 3, Name: 'Scene 4', CreateDate: moment().toDate(), ModifyDate: moment().toDate() },
            ];

            return $q.when(scenes);
        }

        function login() {

        }

        function logout() {

        }
    }
})();