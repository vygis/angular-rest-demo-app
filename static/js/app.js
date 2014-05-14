angular.module("services", ["ngResource"])
    .constant("URL", "http://localhost:8080");
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

    });angular.module("services")
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
    });angular.module("app", ["app.templates", "services", "ui.router", "ui.bootstrap"])
    .constant("DIALOG_DEFAULTS", {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        backdropFade: true
    });
angular.module("app")
    .controller("advertiserDetailsCtrl", function ($scope, $dialog, $stateParams, $state, Resource, DIALOG_DEFAULTS, Utils) {
        var advertiserDetailsResource = Resource("/advertisers/:id/", {id: '@id'}, {
                post: {
                    method: "POST"
                },
                delete: {
                    method: "DELETE"
                }
            }),
            pixelResource = Resource("/pixels/", {}, {
                post: {
                    method: "POST"
                }
            }),
            newPixelDialog = null,
            _openNewPixelDialog = function (){
                if ( newPixelDialog ) {
                    throw new Error('Trying to open a dialog that is already open!');
                }
                var opts = {
                    templateUrl:  'dialogs/pixel-new.tpl.html',
                    controller: 'pixelNewCtrl',
                    resolve: {
                        dialogParams: {
                            getDialog: function () {
                                return newPixelDialog;
                            },
                            pixel: {
                                advertiser_id: $stateParams.id,
                                name: ""
                            },
                            submitFn: function(payload, dialogSuccessCb, dialogErrorCb) {
                                pixelResource.post(payload, function (response){
                                    dialogSuccessCb();
                                    $scope.displayConfirmation("success", "New pixel '" + response.data.name +" 'successfully created");
                                    $scope.getAdvertiserDetails();
                                }, function (error) {
                                    dialogErrorCb(error);
                                })
                            }
                        }
                    }
                };
                newPixelDialog = $dialog.dialog(jQuery.extend(opts, DIALOG_DEFAULTS));
                newPixelDialog.open().then(function(){
                    newPixelDialog = null;
                });
            },
            deleteAdvertiserDialog = null,
            _openDeleteAdvertiserDialog = function (){
                if ( deleteAdvertiserDialog ) {
                    throw new Error('Trying to open a dialog that is already open!');
                }
                var opts = {
                    templateUrl:  'dialogs/advertiser-delete.tpl.html',
                    controller: 'advertiserDeleteCtrl',
                    resolve: {
                        dialogParams: {
                            getDialog: function () {
                                return deleteAdvertiserDialog;
                            },
                            advertiserName: $scope.advertiser.name,
                            submitFn: function(dialogSuccessCb, dialogErrorCb) {
                                advertiserDetailsResource.delete({id: $stateParams.id}, function (response){
                                    dialogSuccessCb();
                                    Utils.sharedData.set('deletedProjectName',response.data.advertiser.name );
                                    $state.go("advertiserList");
                                }, function (error) {
                                    dialogErrorCb(error);
                                })
                            }
                        }
                    }
                };
                deleteAdvertiserDialog = $dialog.dialog(jQuery.extend(opts, DIALOG_DEFAULTS));
                deleteAdvertiserDialog.open().then(function(){
                    deleteAdvertiserDialog = null;
                });
            };

        $scope.newPixel = function() {
            _openNewPixelDialog();
        };

        $scope.deleteAdvertiser = function() {
            _openDeleteAdvertiserDialog();
        };
        $scope.getAdvertiserDetails = function () {
            advertiserDetailsResource.get({id: $stateParams.id}, function (response) {
                var advertiser = response.data.advertiser;
                if(advertiser === null) {
                    $state.go("advertiserList")
                }
                $scope.advertiser = advertiser;
                $scope.advertiserBackup = {};
                $scope.pixels = _.sortBy(response.data.pixels, function (pixel) {
                    return pixel.name.toLowerCase();
                });
            }, function(error){
                console.error(error);
            });
        };

        $scope.displayConfirmation = function(status, message) {
            $scope.status = status;
            $scope.confirmationMessage = message;
        };

        $scope.removeConfirmation = function () {
            $scope.status = "initial";
            $scope.confirmationMessage = "";
        };

        $scope.toggleEdit = function() {
            if($scope.editMode) { //cancelling edit mode
                $scope.advertiser = $scope.advertiserBackup;
            }
            else { //activating edit mode
                $scope.advertiserBackup = jQuery.extend(true, {}, $scope.advertiser);
            }
            $scope.editMode = !$scope.editMode;
        }

        $scope.saveChanges = function () {
            /*chaged API endpoint from PUT to POST
            as I cannot for the life of me find how to make $resource send data in a PUT
            */
            advertiserDetailsResource.post($scope.advertiser, function(response) {
                $scope.displayConfirmation("success", "Update successful");
                $scope.advertiserBackup = response.data.advertiser;
                $scope.toggleEdit();
            }, function(error) {
                $scope.displayConfirmation("error", "Update error: " + error.data);
                $scope.statusMsg = error;
            });
        }

        $scope.editMode = false;

        $scope.getAdvertiserDetails();

    });
angular.module("app")
    .controller("advertiserListCtrl", function ($scope, $dialog, $state, Resource, DIALOG_DEFAULTS, Utils) {
        var advertisersResource = Resource("/advertisers", {}, {
                post: {
                    method: "POST"
                }
            }),
            advertiserEditDialog = null,
            _openAdvertiserEditDialog = function (){
                if ( advertiserEditDialog ) {
                    throw new Error('Trying to open a dialog that is already open!');
                }
                var opts = {
                    templateUrl:  'dialogs/advertiser-new.tpl.html',
                    controller: 'advertiserNewCtrl',
                    resolve: {
                        dialogParams: {
                            getDialog: function () {
                                return advertiserEditDialog;
                            },
                            submitFn: function(payload, dialogSuccessCb, dialogErrorCb) {
                                advertisersResource.post(payload, function (response){
                                    dialogSuccessCb();
                                    $scope.getAdvertisers();
                                    $scope.displayConfirmation("success", "Advertiser '" + response.data.name + "' successfully created");
                                }, function (error) {
                                    dialogErrorCb(error);
                                })
                            }
                        }
                    }
                };
                advertiserEditDialog = $dialog.dialog(jQuery.extend(opts, DIALOG_DEFAULTS));
                advertiserEditDialog.open().then(function(){
                    advertiserEditDialog = null;
                });
            };

        $scope.newAdvertiser = function() {
            _openAdvertiserEditDialog();
        };

        $scope.displayConfirmation = function(status, message) {
            $scope.status = status;
            $scope.confirmationMessage = message;
        };

        $scope.removeConfirmation = function () {
            $scope.status = "initial";
            $scope.confirmationMessage = "";
        };

        $scope.getAdvertisers = function() {
            advertisersResource.get(function (response) {
                $scope.advertisers = _.sortBy(response.data, function(advertiser) {
                    return advertiser.name.toLowerCase();
                });
            }, function(error){
                console.error(error);
            });
        };

        $scope.status = "initial";

        // deleted project confirmation
        var deletedProjectName = Utils.sharedData.get('deletedProjectName');
        if(typeof deletedProjectName !== 'undefined') {
            $scope.displayConfirmation("success", "Project ' " + deletedProjectName + "' has been successfully deleted.")
        };

        $scope.getAdvertisers();

    });
angular.module("app")
    .controller("navbarCtrl", function ($scope) {

     $scope.isActive = function (url) {
        var regexp = new RegExp("#" + url);
        return window.location.href.match(regexp) !== null;
     };
});
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
    });angular.module("app")
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
