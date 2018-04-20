angular.module('reg')
    .controller('AdminUsersCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        'UserService',
        function ($scope, $state, $stateParams, UserService) {

            $scope.pages = [];
            $scope.users = [];

            // Semantic-UI moves modal content into a dimmer at the top level.
            // While this is usually nice, it means that with our routing will generate
            // multiple modals if you change state. Kill the top level dimmer node on initial load
            // to prevent this.
            $('.ui.dimmer').remove();
            // Populate the size of the modal for when it appears, with an arbitrary user.
            $scope.selectedUser = {};
            $scope.selectedUser.sections = generateSections({
                status: '', confirmation: {
                    dietaryRestrictions: []
                }, profile: ''
            });

            function updatePage(data) {
                $scope.users = data.users;
                $scope.currentPage = data.page;
                $scope.pageSize = data.size;

                var p = [];
                for (var i = 0; i < data.totalPages; i++) {
                    p.push(i);
                }
                $scope.pages = p;
            }

            UserService
                .getPage($stateParams.page, $stateParams.size, $stateParams.query, $scope.statusFilters)
                .success(function (data) {
                    updatePage(data);
                });

            $scope.$watch('queryText', function (queryText) {
                UserService
                    .getPage($stateParams.page, $stateParams.size, queryText, $scope.statusFilters)
                    .success(function (data) {
                        updatePage(data);
                    });
            });
            $scope.applyStatusFilter = function () {
                UserService
                    .getPage($stateParams.page, $stateParams.size, $scope.queryText, $scope.statusFilters)
                    .success(function (data) {
                        updatePage(data);
                    });
            };


            $scope.goToPage = function (page) {
                $state.go('app.admin.users', {
                    page: page,
                    size: $stateParams.size || 100
                });
            };

            $scope.goUser = function ($event, user) {
                $event.stopPropagation();

                $state.go('app.admin.user', {
                    id: user._id
                });
            };

            $scope.toggleCheckIn = function ($event, user, index) {
                $event.stopPropagation();

                if (!user.status.checkedIn) {
                    swal({
                            title: "Whoa, wait a minute!",
                            text: "You are about to check in " + user.profile.name + "!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes, check them in.",
                            closeOnConfirm: false
                        },
                        function () {
                            UserService
                                .checkIn(user._id)
                                .success(function (user) {
                                    $scope.users[index] = user;
                                    swal("Accepted", user.profile.name + ' has been checked in.', "success");
                                });
                        }
                    );
                } else {
                    UserService
                        .checkOut(user._id)
                        .success(function (user) {
                            $scope.users[index] = user;
                            swal("Accepted", user.profile.name + ' has been checked out.', "success");
                        });
                }
            };

            $scope.acceptUser = function ($event, user, index) {
                $event.stopPropagation();

                swal({
                    title: "Whoa, wait a minute!",
                    text: "You are about to accept " + user.profile.name + "!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, accept them.",
                    closeOnConfirm: false
                }, function () {

                    swal({
                        title: "Are you sure?",
                        text: "Your account will be logged as having accepted this user. " +
                        "Remember, this power is a privilege.",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, accept this user.",
                        closeOnConfirm: false
                    }, function () {

                        UserService
                            .admitUser(user._id)
                            .success(function (user) {
                                $scope.users[index] = user;
                                swal("Accepted", user.profile.name + ' has been admitted.', "success");
                            });

                    });

                });

            };
            $scope.toggleAdmin = function ($event, user, index) {
                $event.stopPropagation();

                if (!user.admin) {
                    swal({
                            title: "Whoa, wait a minute!",
                            text: "You are about make " + user.profile.name + " and admin!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes, make them an admin.",
                            closeOnConfirm: false
                        },
                        function () {
                            UserService
                                .makeAdmin(user._id)
                                .success(function (user) {
                                    $scope.users[index] = user;
                                    swal("Made", user.profile.name + ' an admin.', "success");
                                });
                        }
                    );
                } else {
                    UserService
                        .removeAdmin(user._id)
                        .success(function (user) {
                            $scope.users[index] = user;
                            swal("Removed", user.profile.name + ' as admin', "success");
                        });
                }
            };

            function formatTime(time) {
                if (time) {
                    return moment(time).format('MMMM Do YYYY, h:mm:ss a');
                }
            }

            $scope.rowClass = function (user) {
                if (user.admin) {
                    return 'admin';
                }
                if (user.status.confirmed) {
                    return 'positive';
                }
                if (user.status.admitted && !user.status.confirmed) {
                    return 'warning';
                }
            };

            function selectUser(user) {
                $scope.selectedUser = user;
                $scope.selectedUser.sections = generateSections(user);
                $('.long.user.modal')
                    .modal('show');
            }

            $scope.exportCSV = function () {
                UserService
                    .getAll()
                    .success(function (data) {

                        var output = '"sep=;"\n"';
                        var titles = generateSections(data[0]);
                        for (var i = 0; i < titles.length; i++) {
                            for (var j = 0; j < titles[i].fields.length; j++) {
                                if (j == titles[i].fields.length) {
                                    output += titles[i].fields[j].name + '";';
                                }
                                else {
                                    output += titles[i].fields[j].name + '"; "';
                                }
                            }
                        }
                        output += '\n';

                        for (var rows = 0; rows < data.length; rows++) {
                            row = generateSections(data[rows]);
                            for (var i = 0; i < row.length; i++) {
                                for (var j = 0; j < row[i].fields.length; j++) {
                                    if (!row[i].fields[j].value) {
                                        output += ";";
                                        continue;
                                    }
                                    var field = row[i].fields[j].value;
                                    try {
                                        output += ' "' + field.replace(/(\r\n|\n|\r)/gm, " ") + '";';
                                    } catch (err) {
                                        output += ' "' + field + '";';
                                    }
                                }
                            }
                            output += "\n";
                        }

                        var element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output));
                        element.setAttribute('download', "HackLyon Export " + new Date().toDateString() + ".csv");
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);

                    });
            }

            function generateSections(user) {
                if (!user.confirmation) {
                    user.confirmation = {phoneNumber: ""};
                }
                return [
                    {
                        name: 'Info',
                        fields: [
                            {
                                name: 'id',
                                value: user.id
                            }, {
                                name: 'fullname',
                                value: user.profile.name
                            }, {
                                name: 'email',
                                value: user.email
                            }, {
                                name: 'time',
                                value: user.timestamp
                            }, {
                                name: 'school',
                                value: user.profile.school
                            }, {
                                name: 'graduation_year',
                                value: user.profile.graduationYear
                            }, {
                                name: 'degree',
                                value: user.profile.degree
                            }, {
                                name: 'major',
                                value: user.profile.discipline
                            }, {
                                name: 'origin',
                                value: user.profile.travel
                            }, {
                                name: 'status',
                                value: user.status.name
                            }, {
                                name: 'over_18',
                                value: user.profile.adult
                            }, {
                                name: 'shirt',
                                value: user.profile.shirtSize
                            }, {
                                name: 'essay',
                                value: user.profile.essay
                            }, {
                                name: 'notes',
                                value: user.profile.suggestion
                            }, {
                                name: 'phone',
                                value: user.confirmation.phoneNumber
                            }, {
                                name: 'signature',
                                value: user.confirmation.signatureLiability
                            }
                        ]
                    }
                ];
            }

            $scope.selectUser = selectUser;

        }]);