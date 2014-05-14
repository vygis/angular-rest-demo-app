angular.module("services")
    .factory("Resource", function ($resource, URL) {
        var defaultParams = {},
            _transformRequest = function (data, headersGetter) {
                var headers = headersGetter();
                headers['Content-Type'] = 'application/json'; //doesn't work :(
            },
            defaultActions = {
                get: {
                    method: 'GET',
                    cache: false
                },
                put: {
                    method: 'PUT',
                    cache: false
                }
            };
            _.each(defaultActions, function(action) {
                action.transformRequest = _transformRequest;
            });

        return function (path, params, actions) {
            return $resource(URL + path, jQuery.extend(true, {}, defaultParams, params), jQuery.extend(true, {}, defaultActions, actions));
        }

    });