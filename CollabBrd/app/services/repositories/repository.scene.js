(function () {
    'use strict';

    var serviceId = 'repository.scene';

    angular
        .module('app')
        .factory(serviceId, repository);

    repository.$inject = ['model', 'repository.abstract'];

    function repository(model, AbstractRepository) {
        var entityName = 'Scene';
        var orderBy = 'CreateDate, Name';
        var Predicate = breeze.Predicate;
        var EntityQuery = breeze.EntityQuery;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            this.getAll = getAll;
            this.getPartials = getPartials;
            this.getByProjectId = getByProjectId;
            this.getById = getById;
            this.create = create;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function create() {
            return this.manager.createEntity(this.entityName);
        }

        function getAll(forceRemote) {
            var self = this;
            var scenes = [];

            if (self._areItemsLoaded() && !forceRemote) {
                return EntityQuery.from('Scenes')
                .orderBy(orderBy)
                .using(self.manager).executeLocally()
                .then(querySucceeded, self._queryFailed);
            }

            return EntityQuery.from('Scenes')
                .orderBy(orderBy)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                self.log('Retrieved [Scenes]', data, true);
                scenes = data.results;
                return scenes;
            }

            return scenes;
        }

        function getPartials(forceRemote) {
            var self = this;
            var scenes = [];

            if (self._areItemsLoaded() && !forceRemote) {
                return EntityQuery.from('Scenes')
                .select('Id, Name, CreateDate, ModifyDate, ProjectId')
                .orderBy(orderBy)
                .using(self.manager).executeLocally()
                .then(querySucceeded, self._queryFailed);
            }

            return EntityQuery.from('Scenes')
                .select('Id, Name, CreateDate, ModifyDate, ProjectId')
                .orderBy(orderBy)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                self.log('Retrieved [Scenes]', data, true);
                scenes = data.results;
                self._setIsPartialTrue(scenes);
                return scenes;
            }

            return scenes;
        }

        function getPartialsByProjectId(projectId, forceRemote) {
            var self = this;
            var whereClause = Predicate.create('ProjectId', '==', projectId);
            var scenes = [];

            if (self._areItemsLoaded() && !forceRemote) {
                return EntityQuery.from('Scenes')
                .select('Id', 'Name', 'CreateDate', 'ModifyDate', 'ProjectId')
                .where(whereClause)
                .orderBy(orderBy)
                .using(self.manager).executeLocally()
                .then(querySucceeded, self._queryFailed);
            }

            return EntityQuery.from('Scenes')
                .select('Id, Name, CreateDate, ModifyDate, ProjectId')
                .where(whereClause)
                .orderBy(orderBy)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                self.log('Retrieved [Scenes]', data, true);
                scenes = data.results;

                self._setIsPartialTrue(scenes);

                return scenes;
            }

            return scenes;
        }

        function getByProjectId(projectId, forceRemote) {
            var self = this;
            var whereClause = Predicate.create('ProjectId', '==', projectId);
            var scenes = [];

            if (self._areItemsLoaded() && !forceRemote) {
                return EntityQuery.from('Scenes')
                .where(whereClause)
                .orderBy(orderBy)
                .using(self.manager).executeLocally()
                .then(querySucceeded, self._queryFailed);
            }

            return EntityQuery.from('Scenes')
                .where(whereClause)
                .orderBy(orderBy)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                self.log('Retrieved [Scenes]', data, true);
                scenes = data.results;
                return scenes;
            }

            return scenes;
        }

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }
    }
})();