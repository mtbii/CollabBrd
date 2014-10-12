(function () {
    'use strict';

    var controllerId = 'projects';

    angular
        .module('app')
        .controller(controllerId, projects);

    projects.$inject = ['$location', '$scope', 'common', 'datacontext'];

    var app = angular.module('app');

    function projects($location, $scope, common, datacontext) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = getLogFn(controllerId, 'success');

        var vm = this;
        vm.title = 'My Projects';
        vm.projects = [];
        vm.selectedProjects = [];
        vm.editedProject = null;
        vm.isSaving = false;

        vm.openNewProjectModal = function () {
            common.dialog.open({
                template: 'add-dialog',
                controller: ['$scope', function ($scope) {
                    $scope.vm = datacontext.project.create();

                    if ($scope.vm.canSave === undefined) {
                        Object.defineProperty($scope.vm, 'canSave', {
                            get: function () {
                                return !vm.isSaving;
                            }
                        });
                    }
                }]
            })
            .closePromise.then(function (data) {
                var projectData = data.value;
                if (common.isValidData(projectData)) {
                    projectData.CreateDateFormatted = moment();
                    datacontext.profile.getCurrentUser().then(function (user) {
                        if (user != null) {
                            projectData.OwnerId = user.Id;
                            vm.saveProject(projectData);
                        }
                        else {
                            datacontext.cancel();
                        }
                    });
                }
                else {
                    datacontext.cancel();
                }
            });
        }

        function onDestroy() {
            $scope.$on('$destroy', function () {
                datacontext.cancel();
            })
        }

        vm.saveProject = function (project) {
            if (project != null) {
                project.ModifyDateFormatted = moment();
                vm.isSaving = true;

                return datacontext.save().then(function (saveResult) {
                    vm.isSaving = false;
                    logSuccess(project.Name + ' saved successfully.');

                }, function (error) {
                    vm.isSaving = false;
                });
            }
        }

        vm.openEditProjectModal = function (project) {
            common.dialog.open({
                template: 'edit-dialog',
                controller: ['$scope', function ($scope) {
                    $scope.vm = project
                    vm.editedProject = project;

                    if ($scope.vm.canSave === undefined) {
                        Object.defineProperty($scope.vm, 'canSave', {
                            get: function () {
                                return !vm.isSaving;
                            }
                        });
                    }
                }]
            })
             .closePromise.then(function (data) {
                 var projectData = data.value;
                 if (projectData != null) {
                     vm.saveProject(projectData);
                 }
                 else {
                     datacontext.cancel();
                 }
             });
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
                vm.selectedProjects[i].entityAspect.setDeleted();
                vm.projects.splice(vm.projects.indexOf(vm.selectedProjects[i]), 1);
            }

            vm.isSaving = true;

            return datacontext.save().then(function () {
                vm.isSaving = false;
                logSuccess(vm.selectedProjects.length + ' project(s) deleted.');
                vm.selectedProjects = [];
            });
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
            onDestroy();
            common.activateController([getProjects()], controllerId)
                .then(function () { log('Activated Projects View'); });
        }

        function getProjects() {
            return datacontext.project.getPartials().then(function (data) {
                var results = data;
                common.utils.addProperty(results, { key: 'Selected', value: false });
                return vm.projects = results;
            });
        }
    }
})();
