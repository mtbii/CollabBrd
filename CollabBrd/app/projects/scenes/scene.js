(function () {
    'use strict';

    var controllerId = 'projects';

    angular
        .module('app')
        .controller(controllerId, projects);

    projects.$inject = ['$location', 'common', 'datacontext'];

    var app = angular.module('app');

    function projects($location, common, datacontext) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = getLogFn(controllerId, 'success');
        var default_project = {
            Selected: false,
            Id: -1,
            Name: '',
            CreateDate: moment().toDate(),
            ModifyDate: moment().toDate()
        };

        var vm = this;
        vm.title = 'My Projects';
        vm.projects = [];
        vm.selectedProjects = [];
        vm.editedProject = null;
        app.title = vm.title;

        vm.openNewProjectModal = function () {
            common.dialog.open({
                template: 'add-dialog',
                controller: ['$scope', function ($scope) {
                    $scope.vm = { Name: '' };
                }]
            })
            .closePromise.then(function (data) {
                var projectData = data.value;
                if (projectData != null) {
                    projectData = $.extend({}, default_project, projectData);

                    vm.createProject(projectData);
                }
            });
        }

        vm.createProject = function (project) {
            if (project != null) {
                logSuccess(project.Name + ' created successfully.');
                vm.projects.push(project);
            }
        }

        vm.openEditProjectModal = function (project) {
            common.dialog.open({
                template: 'edit-dialog',
                controller: ['$scope', function ($scope) {
                    $scope.vm = $.extend(true, {}, project); //deep clone the selected project
                    vm.editedProject = project;
                }]
            })
             .closePromise.then(function (data) {
                 var projectData = data.value;
                 if (projectData != null) {
                     projectData = $.extend({}, default_project, projectData);

                     vm.editProject(projectData);
                 }
             });
        }

        vm.editProject = function (project) {
            if (project != null) {
                vm.projects[vm.projects.indexOf(vm.editedProject)] = project;
                vm.editedProject = null;
                logSuccess(project.Name + ' edited successfully.');
            }
        }

        vm.openDeleteProjectModal = function () {
            common.dialog.open({
                template: 'confirm-delete-dialog',
                controller: ['$scope', function ($scope) {
                    $scope.vm = vm.selectedProjects;
                }]
            })
                .closePromise.then(function (data) {
                    if (data.value === true) {
                        vm.deleteProjects();
                    }
                });
        }

        vm.deleteProjects = function () {

            for (var i = 0; i < vm.selectedProjects.length; i++) {
                vm.projects.splice(vm.projects.indexOf(vm.selectedProjects[i]), 1);
            }

            logSuccess(vm.selectedProjects.length + ' project(s) deleted.');
            vm.selectedProjects = [];
        }

        vm.changeSelected = function (project) {
            if (!project.Selected) {
                vm.selectedProjects.push(project);
            }
            else {
                vm.selectedProjects.splice(vm.selectedProjects.indexOf(project), 1);
            }
        }

        activate();

        function activate() {
            common.activateController([getProjects()], controllerId)
                .then(function () { log('Activated Projects View'); });
        }

        function getProjects() {
            return datacontext.projects.getProjects().then(function (data) {
                common.utils.addProperty(data, { key: 'Selected', value: false });
                return vm.projects = data;
            });
        }
    }
})();
