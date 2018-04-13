angular.module('reg')
    .controller('ConfirmationCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        'currentUser',
        '$translate',
        '$translatePartialLoader',
        'Utils',
        'UserService',
        function ($scope, $rootScope, $state, currentUser, $translate, $translatePartialLoader, Utils, UserService) {

            $translatePartialLoader.addPart('confirmation');
            $translatePartialLoader.addPart('sidebar');
            $translate.refresh();

            // Set up the user
            var user = currentUser.data;
            $scope.user = user;

            $scope.pastConfirmation = Date.now() > user.status.confirmBy;

            $scope.formatTime = Utils.formatTime;

            _setupForm();

            $scope.fileName = user._id + "_" + user.profile.name.split(" ").join("_");

            function _updateUser(e) {
                var confirmation = $scope.user.confirmation;
                UserService
                    .updateConfirmation(user._id, confirmation)
                    .success(function (data) {
                        sweetAlert({
                            title: "Woo!",
                            text: "You're confirmed!",
                            type: "success",
                            confirmButtonColor: "#e76482"
                        }, function () {
                            $state.go('app.dashboard');
                        });
                    })
                    .error(function (res) {
                        sweetAlert("Uh oh!", "Something went wrong.", "error");
                    });
            }

            function _setupForm() {
                // Semantic-UI form validation
                $('.ui.form').form({
                    fields: {
                        phone: {
                            identifier: 'phone',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter a phone number.'
                                }
                            ]
                        },
                        signatureLiability: {
                            identifier: 'signatureLiabilityWaiver',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please type your digital signature.'
                                }
                            ]
                        },
                        signaturePhotoRelease: {
                            identifier: 'signaturePhotoRelease',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please type your digital signature.'
                                }
                            ]
                        },
                        emergencyName: {
                            identifier: 'emergencyName',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter a contact name.'
                                }
                            ]
                        },
                        emergencyPhoneNumber: {
                            identifier: 'emergencyPhoneNumber',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter a contact phone number.'
                                }
                            ]
                        },
                    }
                });
            }

            $scope.submitForm = function () {
                if ($('.ui.form').form('is valid')) {
                    _updateUser();
                }
            };

        }]);