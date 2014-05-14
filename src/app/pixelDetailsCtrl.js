angular.module("app")
    .controller("pixelDetailsCtrl", function ($scope, $dialog, $stateParams, Resource, Utils) {
        $scope.formatDate = Utils.formatDate;
        var advertiserDetailsResource = Resource("/pixels/:id/", {id: '@id'});
        advertiserDetailsResource.get({id: $stateParams.pixId}, function (response) {
            var data = response.data;
            $scope.pixel = data.pixel;
            $scope.fires = data.fires;
        }, function(error){
            console.error(error);
        });
    });