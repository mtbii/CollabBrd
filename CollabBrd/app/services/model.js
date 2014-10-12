(function () {
    'use strict';

    angular
        .module('app')
        .factory('model', model);

    //model.$inject = ['$http'];

    function model() {

        var service = {
            configureMetadataStore: configureMetadataStore
        };

        return service;

        function configureMetadataStore(metadataStore) {
            //Configure Project
            registerProject(metadataStore);
            //Configure Scene
            registerScene(metadataStore);
            //Configure Profile
            registerProfile(metadataStore);
        }

        function registerProfile(metadataStore) {
            metadataStore.registerEntityTypeCtor('Profile', Profile);

            function Profile() {
                this.isPartial = false;
            }
        }

        function registerProject(metadataStore) {
            metadataStore.registerEntityTypeCtor('Project', Project);

            function Project() {
                this.isPartial = false;
            }

            Object.defineProperty(Project.prototype, 'CreateDateFormatted', {
                get: function () {
                    return moment(this.CreateDate).format('M/D/YY hh:mm a');
                },
                set: function (value) {
                    this.CreateDate = moment(value).format('M/D/YY hh:mm a');
                }
            });

            Object.defineProperty(Project.prototype, 'ModifyDateFormatted', {
                get: function () {
                    return moment(this.ModifyDate).format('M/D/YY hh:mm a');
                },
                set: function (value) {
                    this.ModifyDate = moment(value).format('M/D/YY hh:mm a');
                }
            });
        }

        function registerScene(metadataStore) {
            metadataStore.registerEntityTypeCtor('Scene', Scene);

            function Scene() {
                this.isPartial = false;
            }

            Object.defineProperty(Scene.prototype, 'CreateDateFormatted', {
                get: function () {
                    return moment(this.CreateDate).format('M/D/YY hh:mm a');
                },
                set: function (value) {
                    this.CreateDate = moment(value).format('M/D/YY hh:mm a');
                }
            });

            Object.defineProperty(Scene.prototype, 'ModifyDateFormatted', {
                get: function () {
                    return moment(this.ModifyDate).format('M/D/YY hh:mm a');
                },
                set: function (value) {
                    this.ModifyDate = moment(value).format('M/D/YY hh:mm a');
                }
            });
        }
    }
})();