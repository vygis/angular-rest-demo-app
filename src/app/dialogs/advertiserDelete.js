angular.module("app")
    .controller("advertiserDeleteCtrl", function ($scope, dialogParams) {
        $scope.advertiserName = dialogParams.advertiserName;
        $scope.status = "initial";

        $scope.submit = function () {
            dialogParams.submitFn(function(){
                dialogParams.getDialog().close(true);
            }, function(error) {
                $scope.errorMsg = error.data;
                $scope.status = "error";
            });
        }
        $scope.cancel = function () {
            dialogParams.getDialog().close(false);
        }
    });
