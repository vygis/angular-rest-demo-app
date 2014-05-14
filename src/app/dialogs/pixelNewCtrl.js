angular.module("app")
    .controller("pixelNewCtrl", function ($scope, dialogParams) {
        $scope.pixel = dialogParams.pixel;

        $scope.status = "initial";

        $scope.submit = function () {
            dialogParams.submitFn($scope.pixel, function(){
                dialogParams.getDialog().close(true);
            }, function(error) {
                $scope.errorMsg = error.data;
                $scope.status = "error";
            });
        };

        $scope.cancel = function () {
            dialogParams.getDialog().close(false);
        }
    });
