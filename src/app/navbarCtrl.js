angular.module("app")
    .controller("navbarCtrl", function ($scope) {

     $scope.isActive = function (url) {
        var regexp = new RegExp("#" + url);
        return window.location.href.match(regexp) !== null;
     };
});
