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
