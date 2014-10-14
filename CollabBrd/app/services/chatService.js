(function () {
    'use strict';

    angular
        .module('app')
        .factory('chatService', chatService);

    chatService.$inject = ['Hub', 'authentication', '$http'];

    function chatService(Hub, auth, $http) {

        var hub = new Hub('chatHub', {

            //client side methods
            listeners: {
                'addNewMessageToPage': function (name, message) {
                    if (service.receive) {
                        service.receive(name, message);
                    }
                }
            },

            //server side methods
            methods: ['send', 'joinRoom', 'leaveRoom'],

            //query params sent on initial connection
            queryParams: {
                'token': 'exampletoken'
            },

            //handle connection error
            errorHandler: function (error) {
                console.error(error);
            }

        });

        function receive() { }

        function send(name, message, groupName) {
            if (groupName == '/') {
                groupName = 'World';
            }
            try {
                // Call the Send method on the hub. 
                hub.send(name, message, groupName);
            }
            catch (e) {
                reconnect(send, [name, message, groupName]);
            }
        }


        function join(groupName) {
            if (groupName == '/') {
                groupName = 'World';
            }
            try {
                hub.joinRoom(groupName, auth.authentication.userName);
            }
            catch (e) {
                reconnect(join, [groupName, auth.authentication.userName]);
            }
        }

        function leave(groupName) {
            if (groupName == '/') {
                groupName = 'World';
            }
            try {
                hub.leaveRoom(groupName, auth.authentication.userName);
            }
            catch (e) {
                reconnect(leave, [groupName, auth.authentication.userName]);
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
            send: send,
            receive: receive,
            join: join,
            reconnect: reconnect,
            leave: leave
        }

        return service;
    }
})();