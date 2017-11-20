app.factory('Data', ['$http', 'toaster',
    function ($http, toaster) { // This service connects to our REST API

        var serviceBase = 'api/v1/';

        var obj = {};
        obj.toast = function (data) {
            toaster.pop(data.status, "", data.message, 3000, 'trustedHtml');
        }
        obj.get = function (q) {
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        obj.getWhere = function (q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };

        return obj;
    }]);

app.factory('appData', [function () {
    var cache = {};
    return {
        set: function (location, payload) {
            cache[location] = payload;
        },
        get: function (location) {
            return cache[location];
        },
        remove: function (location) {
            delete cache[location];
        },
        clear: function () {
            cache = {};
        }
    };
}]);

app.factory('keyData', ['Data', function (Data) {
    var cache = {};
    var srv = {};
    return {
        set: function (key, payload) {
            cache[key] = payload;
        },
        get: function (key) {
            return cache[key];
        },
        clear: function () {
            cache = {};
            srv = {};
        },
        remove: function (key) {
            if (key in srv) {
                Data.post('unsetSession', key);
                delete srv[key];
            }
            delete cache[key];
        },
        check: function (key) {
            if (cache[key] === undefined) {
                if (srv[key] === undefined) {
                    return false;
                    Data.post('getSession', key).then(function (results) {
                        if (results.status != "success") {
                            return false;
                        }
                        srv[key] = results.value;
                        cache[key] = srv[key];
                    });
                }
            }
            return true;
        },
        post: function (key, payload) {
            cache[key] = payload;
            Data.post('setSession', { [key]: payload }).then(function (results) {
                srv[key] = payload;
            });
        },
        load: function (key) {
            Data.post('getSession', key).then(function (results) {
                if (results.status == "success") {
                    cache[key] = results.value;
                }
            });
        }
    };
}]);