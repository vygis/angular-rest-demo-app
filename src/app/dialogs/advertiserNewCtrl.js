angular.module("app")
    .controller("advertiserNewCtrl", function ($scope, dialogParams) {
        $scope.advertiser = {
            name: "",
            city: "",
            address: "",
            post_code: "",
            tel: ""
        };

        $scope.status = "initial";

        $scope.submit = function () {
            dialogParams.submitFn($scope.advertiser, function(){
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
