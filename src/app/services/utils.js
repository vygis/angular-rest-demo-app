angular.module("services")
    .factory("Utils", function () {
        var sharedData = {};
        return {
            formatDate: function (dateString) { //dates seem to come back as unix timestamp on MacOS
                return dateString.match(/(\w|-)+/)[0].replace(/-/g, '/');
            },
            sharedData: {
                set: function(name, value) {
                    sharedData[name] = value;
                },
                get: function(name) {
                    return sharedData[name];
                }
            }
        }
    });