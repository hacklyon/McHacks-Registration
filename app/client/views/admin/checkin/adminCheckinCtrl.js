angular.module('reg')
    .controller('AdminCheckinCtrl', [
        '$scope',
        '$http',
        '$window',
        'UserService',
        function ($scope, $http, $window, UserService) {
            $scope.selectedUser = {};

            $scope.loaded = false;

            $scope.updateProfile = function () {
                UserService
                    .updateProfile($scope.selectedUser._id, $scope.selectedUser.profile)
                    .success(function (data) {
                        $selectedUser = data;
                        swal("Updated!", "Profile updated.", "success");
                    })
                    .error(function () {
                        swal("Oops, you forgot something.");
                    });
            };


            $scope.formatTime = function (time) {
                return moment(time).format('MMMM Do YYYY, h:mm:ss a');
            };

            $scope.openCamera = function () {

            };

            $scope.toggleCheckIn = function ($event) {
                $event.stopPropagation();

                if (!$scope.selectedUser.status.checkedIn) {
                    swal({
                            title: "Whoa, wait a minute!",
                            text: "You are about to check in " + $scope.selectedUser.profile.name + "!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes, check them in.",
                            closeOnConfirm: false
                        },
                        function () {
                            UserService
                                .checkIn($scope.selectedUser._id)
                                .success(function (user) {
                                    $scope.selectedUser = user;
                                    swal("Accepted", user.profile.name + ' has been checked in.', "success");
                                });
                        }
                    );
                } else {
                    UserService
                        .checkOut($scope.selectedUser._id)
                        .success(function (user) {
                            $scope.selectedUser = user;
                            swal("Accepted", user.profile.name + ' has been checked out.', "success");
                        });
                }
            };

            $scope.$on('$viewContentLoaded', function () {
                $scope.openCamera = function () {
                    let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
                    scanner.addListener('scan', function (content) {
                        if(content.substr(0, 11) === 'hacklyon://') {
                            let id = content.substr(11);
                            console.log(content);
                            UserService
                                .get(id)
                                .success(function (data) {
                                    console.log(data);
                                    if(!data) {
                                        swal("Dat user does not exists on this DB.");
                                    }
                                    $scope.selectedUser = data;
                                    $scope.loaded = true;

                                    scanner.stop();
                                })
                                .error(function(){
                                    swal("Oops, you forgot something.");
                                })
                        }

                    });
                    Instascan.Camera.getCameras().then(function (cameras) {
                        if (cameras.length > 0) {
                            scanner.start(cameras[0]);
                        } else {
                            console.error('No cameras found.');
                        }
                    }).catch(function (e) {
                        console.error(e);
                    });
                }
            });

        }]);