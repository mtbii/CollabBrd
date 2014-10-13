(function () {
    'use strict';

    angular
        .module('app')
        .factory('canvasService', canvasService);

    canvasService.$inject = ['Hub', '$http'];

    function canvasService(Hub, $http) {
        //declaring the hub connection
        var hub = new Hub('whiteboardHub', {

            //client side methods
            listeners: {
                'syncWhiteboard': function (name, sceneJSON) {
                    if (service.receiveJSON) {
                        service.receiveJSON(name, sceneJSON);
                    }
                }
            },

            //server side methods
            methods: ['syncWhiteboard', 'joinWhiteboard', 'leaveWhiteboard'],

            //query params sent on initial connection
            queryParams: {
                'token': 'exampletoken'
            },

            //handle connection error
            errorHandler: function (error) {
                console.error(error);
            }

        });

        function syncWhiteboard(groupName, name, sceneJSON) {
            try {
                hub.syncWhiteboard(groupName, name, JSON.stringify(sceneJSON));
            }
            catch (e) {
                reconnect(syncWhiteboard, [groupName, name, sceneJSON]);
            }
        }

        function join(groupName) {
            try {
                hub.joinWhiteboard(groupName);
            }
            catch (e) {
                reconnect(join, [groupName]);
            }
        }

        function leave(groupName) {
            try {
                hub.leaveWhiteboard(groupName);
            }
            catch (e) {
                reconnect(leave, [groupName]);
            }
        }

        function reconnect(callback, args) {
            hub.connection.start().then(function () {
                if (callback != null) {
                    callback.apply(this, args);
                }
            });
        }

        var service = {
            sync: syncWhiteboard,
            join: join,
            leave: leave,
            reconnect: reconnect,
            receiveJSON: null
        };

        return service;
    }
})();