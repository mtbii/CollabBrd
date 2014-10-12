(function () {
    'use strict';

    var serviceId = 'repository.project';

    angular
        .module('app')
        .factory(serviceId, repository);

    repository.$inject = ['model', 'repository.abstract'];

    function repository(model, AbstractRepository) {
        var entityName = 'Project';
        //var entityNames = model.entityNames;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'CreateDate, Name';
        var Predicate = breeze.Predicate;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            this.getAll = getAll;
            this.getPartials = getPartials;
            this.getById = getById;
            this.create = create;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function create() {
            return this.manager.createEntity(this.entityName);
        }

        function getPartials(forceRemote) {
            var self = this;
            var projects = [];

            if (self._areItemsLoaded() && !forceRemote) {
                return EntityQuery.from('UserProjects').toType(entityName)
                .select('Id, Name, CreateDate, ModifyDate')
                .orderBy(orderBy)
                .using(self.manager).executeLocally()
                .then(querySucceeded, self._queryFailed);
            }

            return EntityQuery.from('UserProjects').toType(entityName)
            .select('Id, Name, CreateDate, ModifyDate')
            .orderBy(orderBy)
            .using(self.manager).execute()
            .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                self.log('Retrieved [User Projects]', data, true);
                projects = data.results;
                self._setIsPartialTrue(projects);

                return projects;
            }

            return projects;
        }

        function getAll(forceRemote) {
            var self = this;

            if (self._areItemsLoaded() && !forceRemote) {
                return EntityQuery.from('UserProjects').toType(entityName)
                //.where(predicate)
                .orderBy(orderBy)
                .using(self.manager).executeLocally()
                .then(querySucceeded, self._queryFailed);
            }

            return EntityQuery.from('UserProjects').toType(entityName)
                //.where(predicate)
                .orderBy(orderBy)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                self.log('Retrieved [User Projects]', data, true);
                return data;
            }
        }

        function getById(id, forceRemote, eagerLoad) {
            return this._getById(entityName, id, forceRemote, eagerLoad);
        }
    }
})();