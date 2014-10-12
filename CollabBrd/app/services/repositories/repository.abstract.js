(function () {
    'use strict';

    angular
        .module('app')
        .factory('repository.abstract', repository);

    repository.$inject = ['common', 'config'];

    function repository(common, config) {

        var EntityQuery = breeze.EntityQuery;
        var logError = common.logger.getLogFn(this.serviceId, 'error');

        function Ctor() {
            this.isLoaded = false;
        }

        Ctor.extend = function (repoCtor) {
            repoCtor.prototype = new Ctor();
            repoCtor.prototype.constructor = repoCtor;
        }

        Ctor.prototype._areItemsLoaded = _areItemsLoaded;
        Ctor.prototype._getAllLocal = _getAllLocal;
        Ctor.prototype._getInlineCount = _getInlineCount;
        Ctor.prototype._getLocalEntityCount = _getLocalEntityCount;
        Ctor.prototype._queryFailed = _queryFailed;
        Ctor.prototype._getById = _getById;
        Ctor.prototype._setIsPartialTrue = _setIsPartialTrue

        Ctor.prototype.log = common.logger.getLogFn(this.serviceId);
        Ctor.prototype.$q = common.$q;

        return Ctor;

        function _areItemsLoaded(value) {
            if (value === undefined) {
                return this.isLoaded;
            }
            return this.isLoaded = value;
        }

        function _getAllLocal(resource, ordering, predicate) {
            return EntityQuery.from(resource)
            .orderBy(ordering)
            .where(predicate)
            .using(this.manager)
            .executeLocally();
        }

        function _getById(entityName, id, forceRemote, eagerLoad) {
            var self = this;
            var manager = self.manager;
            var entityType = null;

            if (!forceRemote) {
                try {
                    entityType = manager.metadataStore.getEntityType(entityName);
                    return fetchEntity();
                }
                catch (e) {
                    return manager.fetchMetadata().then(function () {
                        entityType = manager.metadataStore.getEntityType(entityName);
                        return fetchEntity();
                    });
                }
            }

            return loadFromRemote();

            function loadFromRemote() {

                if (eagerLoad != null) {
                    return EntityQuery.from(manager.metadataStore.getEntityType(entityName).defaultResourceName)
                    .where('Id', 'eq', id)
                    .expand(eagerLoad)
                    .using(manager).execute()
                    .then(queryWithExpandSucceeded, self._queryFailed);
                }
                else {
                    return manager.fetchEntityByKey(entityName, id)
                    .then(querySucceeded, self._queryFailed);
                }
            }

            function queryWithExpandSucceeded(data) {
                if (data.results && data.results.length > 0) {
                    var entity = data.results[0];
                    if (!entity) {
                        self.log('Could not find [' + entityName + '] id:' + id, null, true);
                    }
                    entity.isPartial = false;
                    self.log('Retrieved [' + entityName + '] id:' + entity.Id + ' from remote data source.', entity, true);
                    return entity;
                }
                return null;
            }

            function querySucceeded(data) {
                var entity = data.entity;
                if (!entity) {
                    self.log('Could not find [' + entityName + '] id:' + id, null, true);
                }
                entity.isPartial = false;
                self.log('Retrieved [' + entityName + '] id:' + entity.Id + ' from remote data source.', entity, true);
                return entity;
            }

            function fetchEntity() {
                var entity = manager.getEntityByKey(new breeze.EntityKey(entityType, new Number(id)));
                var fullyLoaded = true;
                if (entity && !entity.isPartial) {
                    if (eagerLoad != null) {
                        var eagerLoadList = eagerLoad.split(',');
                        for (var i = 0; i < eagerLoadList.length; i++) {
                            if (entity[eagerLoadList[i].trim()] == null) {
                                fullyLoaded = false;
                                break;
                            }
                        }
                    }
                    else {
                        self.log('Retrieved [' + entityName + '] id:' + entity.Id + ' from cache.', entity, true);
                        if (entity.entityAspect.entityState.isDeleted()) {
                            entity = null;
                        }
                    }

                    if (fullyLoaded) {
                        return $q.when(entity);
                    }
                    else {
                        return loadFromRemote();
                    }
                }

                //Not in cache, so retrieve from server
                return loadFromRemote();
            }
        }

        function _getInlineCount(data) {
            return data.inlineCount;
        }

        function _getLocalEntityCount(resource) {
            var entities = EntityQuery.from(resource)
            .using(this.manager)
            .executeLocally();
            return entities.length;
        }

        function _queryFailed(error) {
            var msg = config.appErrorPrefix + 'Error retrieving data.' + error.message;
            logError(msg, error);
            throw error;
        }

        function _setIsPartialTrue(entities) {
            for (var i = 0; i < entities.length; i++) {
                entities[i].isPartial = true;
            }
            return entities;
        }
    }
})();