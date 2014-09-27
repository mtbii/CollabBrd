(function () {
    'use strict';

    angular
        .module('common')
        .factory('utils', utils);

    function utils() {

        var service = {
            forceArray: forceArray,
            addProperty: addProperty
        }

        return service;

        function forceArray(obj) {
            if ($.isArray(obj)) {
                return obj
            }
            else {
                return [obj];
            }
        }

        function addProperty(obj, prop) {
            var objArray = forceArray(obj);
            prop = $.extend({}, { key: '', value: null }, prop);

            objArray.forEach(function (val) {
                val[prop.key] = prop.value;
            });

            if (objArray.length == 1) {
                return objArray[0];
            }
            return objArray;
        }
    }
}
)();