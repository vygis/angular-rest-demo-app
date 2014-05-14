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
