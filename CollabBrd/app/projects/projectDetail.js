(function () {
    'use strict';

    var controllerId = 'projectDetail'

    angular
        .module('app')
        .controller(controllerId, projectDetail);

    projectDetail.$inject = ['$location', '$routeParams', 'datacontext', 'common'];

    function projectDetail($location, $routeParams, datacontext, common) {
        /* jshint validthis:true */
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = getLogFn(controllerId, 'success');

        var vm = this;
        vm.title = 'Project Detail';
        vm.projectId = $routeParams.projectId;
        vm.project = null;
        vm.selectedScenes = [];
        vm.editedScene = null;
        vm.isSaving = false;

        vm.openNewSceneModal = function () {
            common.dialog.open({
                template: 'add-dialog',
                controller: ['$scope', function ($scope) {
                    $scope.vm = datacontext.scene.create();

                    Object.defineProperty($scope.vm, 'canSave', {
                        get: function () {
                            return !vm.isSaving;
                        }
                    });
                }]
            })
            .closePromise.then(function (data) {
                var sceneData = data.value;
                if (common.isValidData(sceneData)) {
                    sceneData.CreateDateFormatted = moment();
                    datacontext.profile.getCurrentUser().then(function (user) {
                        if (user != null) {
                            sceneData.ProjectId = vm.project.Id;

                            vm.saveScene(sceneData);
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

        vm.saveScene = function (scene) {
            if (scene != null) {
                scene.ModifyDateFormatted = moment();
                vm.isSaving = true;

                return datacontext.save().then(function (saveResult) {
                    vm.isSaving = false;
                    logSuccess(scene.Name + ' created successfully.');

                }, function (error) {
                    vm.isSaving = false;
                });

                //vm.scenes.push(scene);
            }
        }

        vm.openEditSceneModal = function (scene) {
            common.dialog.open({
                template: 'edit-dialog',
                controller: ['$scope', function ($scope) {
                    $scope.vm = scene //deep clone the selected scene
                    vm.editedScene = scene;
                }]
            })
             .closePromise.then(function (data) {
                 var sceneData = data.value;
                 if (sceneData != null) {
                     //sceneData = $.extend({}, default_scene, sceneData);
                     //vm.editScene(sceneData);
                     vm.saveScene(sceneData);
                 }
                 else {
                     datacontext.cancel();
                 }
             });
        }

        //vm.editScene = function (scene) {
        //    if (scene != null) {
        //        vm.scenes[vm.scenes.indexOf(vm.editedScene)] = scene;
        //        vm.editedScene = null;
        //        logSuccess(scene.Name + ' edited successfully.');
        //    }
        //}

        vm.openDeleteSceneModal = function () {
            common.dialog.open({
                template: 'confirm-delete-dialog',
                controller: ['$scope', function ($scope) {
                    $scope.vm = vm.selectedScenes;
                }]
            })
                .closePromise.then(function (data) {
                    if (data.value === true) {
                        vm.deleteScenes();
                    }
                });
        }

        vm.deleteScenes = function () {

            for (var i = 0; i < vm.selectedScenes.length; i++) {
                vm.selectedScenes[i].entityAspect.setDeleted();
                vm.scenes.splice(vm.scenes.indexOf(vm.selectedScenes[i]), 1);
            }

            vm.isSaving = true;

            return datacontext.save().then(function () {
                vm.isSaving = false;
                logSuccess(vm.selectedScenes.length + ' scene(s) deleted.');
                vm.selectedScenes = [];
            });
        }

        vm.changeSelected = function (scene) {
            if (!scene.Selected) {
                vm.selectedScenes.push(scene);
            }
            else {
                vm.selectedScenes.splice(vm.selectedScenes.indexOf(scene), 1);
            }
        }


        activate();

        function activate() {
            common.activateController([getScenes()], controllerId)
                .then(function () { log('Activated Project Detail View'); });
        }

        function getScenes() {
            return datacontext.project.getById(vm.projectId, false, 'Scenes').then(function (data) {
                vm.project = data;
                common.utils.addProperty(vm.project.Scenes, { key: 'Selected', value: false });
            });
        }
    }
})();
