(function () {
    'use strict';

    var serviceId = 'repository.profile';

    angular
        .module('app')
        .factory(serviceId, repository);

    repository.$inject = ['model', 'repository.abstract', '$http'];

    function repository(model, AbstractRepository, $http) {
        var entityName = 'Profile';
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'UserName';
        var Predicate = breeze.Predicate;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            this.getAll = getAll;
            this.getPartials = getPartials;
            this.getById = getById;
            this.create = create;
            this.getCurrentUser = getCurrentUser;
            this.getGuestProfile = getGuestProfile;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function create() {
            return this.manager.createEntity(this.entityName);
        }

        function getCurrentUser(forceRemote) {
            var self = this;
            var profile = null;

            if (self._areItemsLoaded() && !forceRemote) {
                return EntityQuery.from('CurrentUser').toType(entityName)
                .using(self.manager).executeLocally()
                .then(querySucceeded, self._queryFailed);
            }

            return EntityQuery.from('CurrentUser').toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                self.log('Retrieved [Current User]', data, true);
                if (data.results.length > 0) {
                    profile = data.results[0];
                    return profile;
                }
                return null;
            }

            return profile;
        }

        function getPartials(forceRemote) {
            var self = this;
            var profiles = [];

            if (self._areItemsLoaded() && !forceRemote) {
                return EntityQuery.from('UserProfiles').toType(entityName)
                .select('Id, UserName, CreateDate')
                .orderBy(orderBy)
                .using(self.manager).executeLocally()
                .then(querySucceeded, self._queryFailed);
            }

            return EntityQuery.from('UserProfiles').toType(entityName)
                .select('Id, UserName, CreateDate')
                .orderBy(orderBy)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                self.log('Retrieved [User Profiles]', data, true);
                profiles = data.results;
                self._setIsPartialTrue(profiles);

                return profiles;
            }

            return profiles;
        }

        function getAll(forceRemote) {
            var self = this;

            if (self._areItemsLoaded() && !forceRemote) {
                return EntityQuery.from('UserProfiles').toType(entityName)
                //.where(predicate)
                .orderBy(orderBy)
                .using(self.manager).executeLocally()
                .then(querySucceeded, self._queryFailed);
            }

            return EntityQuery.from('UserProfiles').toType(entityName)
                //.where(predicate)
                .orderBy(orderBy)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                self.log('Retrieved [User Profiles]', data, true);
                return data;
            }
        }

        function getById(id, forceRemote, eagerLoad) {
            return this._getById(entityName, id, forceRemote, eagerLoad);
        }

        function getGuestProfile() {
            var self = this;
            var profile = null;

            if (self._areItemsLoaded() && !forceRemote) {
                return EntityQuery.from('GuestProfile').toType(entityName)
                .using(self.manager).executeLocally()
                .then(querySucceeded, self._queryFailed);
            }

            return EntityQuery.from('GuestProfile').toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                self.log('Retrieved [GuestProfile]', data, true);
                if (data.results.length > 0) {
                    profile = data.results[0];
                    return profile;
                }
                return null;
            }

            return profile;
        }
    }
})();