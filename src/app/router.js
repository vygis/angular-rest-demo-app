angular.module("app")
    .constant("HOME_STATE", "/advertisers")
    .config(function($stateProvider, $urlRouterProvider, HOME_STATE){
    $urlRouterProvider.otherwise(HOME_STATE);

    $stateProvider
        .state('advertiserList', {
            url: "/advertisers",
            templateUrl: "advertiser-list.tpl.html"
        })
        .state('advertiserDetails', {
            url: "/advertisers/:id/",
            templateUrl: "advertiser-details.tpl.html"
        })
        .state('pixelDetails', {
            url: "/advertisers/:adId/pixels/:pixId",
            templateUrl: "pixel-details.tpl.html"
        })
    });

