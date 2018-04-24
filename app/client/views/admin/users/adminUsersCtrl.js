angular.module('reg')
    .controller('AdminUsersCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        'UserService',
        'LOGOS',
        function ($scope, $state, $stateParams, UserService, LOGOS) {

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
                $('.selected-user.long.user.modal')
                    .modal('show');
            }

            let scanner;

            $scope.searchByQR = function () {
                scanner = new Instascan.Scanner({video: document.getElementById('preview')});
                $('.qr-cam')
                    .modal({
                        onHide: function () {
                            scanner.stop();
                            return true;
                        }
                    })
                    .modal('show');
                scanner.addListener('scan', function (content) {
                    if (content.substr(0, 11) === 'hacklyon://') {
                        let id = content.substr(11);
                        UserService
                            .get(id)
                            .success(function (data) {
                                if (!data) {
                                    swal("Dat user does not exists on this DB.");
                                    console.log(data);
                                }
                                scanner.stop();
                                $('.qr-cam').modal('hide');
                                $state.go('app.admin.user', {
                                    id: data._id
                                });
                            })
                            .error(function () {
                                swal("Oops, you forgot something.");
                            })
                    } else {
                        swal("Oops, invalid QR code.");
                        console.log(content)
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
            };
            $scope.externalUsers = "";
            $scope.openGenerator = function () {
                $(".badge-modal")
                    .modal({onApprove: function () {$scope.generateBadges();}})
                    .modal('show');
            }
            ;

            $scope.generateBadges = function () {
                let badges = [];
                if ($scope.externalUsers.length) {
                    let users = $scope.externalUsers.split("\n");
                    users.forEach(function (user) {
                        let fields = user.split(";");
                        let u = {
                            profile: {firstName: fields[0].trim(), lastName: fields[1].trim()},
                            type: parseInt(fields[2])
                        };
                        badges.push(u);
                    });
                }
                UserService
                    .getAll()
                    .success(function (data) {
                        let confirmed = badges;

                        for (let i = 0; i < data.length; i++) {
                            let user = data[i];
                            //console.log(user.Status);
                            if (user.status.name === 'confirmed' || user.status.name === 'admitted') {
                                user.type = 1; //hacker
                                confirmed.push(user);
                            }
                        }

                        const doc = new jsPDF();

                        function rgb(r, g, b) {
                            this.r = r;
                            this.g = g;
                            this.b = b;
                        }

                        function Rect(user, index, phase) {
                            this.x = 15;
                            this.y = 55 * index + 8 + phase;
                            this.user = user;
                            this.fname = user.profile.firstName || "";
                            this.lname = user.profile.lastName || "";
                            this.id = user.id || "";
                            this.draw = function () {
                                if (this.id.length) {
                                    const qr = new QRious({
                                        value: 'hacklyon://' + this.id
                                    });
                                    let qrcode = qr.toDataURL();
                                    doc.addImage(qrcode, 'PNG', this.x + 67.5, this.y + 5, 12.5, 12.5);
                                }
                                //doc.rect(this.x, this.y, 85, 55); doc.rect(this.x + 85, this.y, 85, 55);
                                doc.line(this.x - 1, this.y, this.x + 1, this.y);
                                doc.line(this.x, this.y - 1, this.x, this.y + 1);

                                doc.line(this.x + 85 - 1, this.y, this.x + 85 + 1, this.y);
                                doc.line(this.x + 85, this.y, this.x + 85, this.y + 1);

                                doc.line(this.x + 170 - 1, this.y, this.x + 170 + 1, this.y);
                                doc.line(this.x + 170, this.y - 1, this.x + 170, this.y + 1);

                                doc.addImage(LOGOS.ALPHA, 'PNG', this.x + 5, this.y + 5, 24, 10);

                                let color;
                                let role;
                                let role_phase = 0;

                                switch (this.user.type) {
                                    case 1:
                                        color = new rgb(58, 102, 150);
                                        role = "Hacker";
                                        break;
                                    case 2:
                                        color = new rgb(66, 220, 163); // Green alpha
                                        role = "Coach";
                                        break;
                                    case 3:
                                        color = new rgb(66, 220, 163); // TODO : CHANGE
                                        role = "Mentor";
                                        break;
                                    case 4:
                                        color = new rgb(250, 189, 35); //Yellow
                                        role = "Photographe";
                                        role_phase = -12;
                                        break;
                                    case 5:
                                        color = new rgb(66, 220, 163); // TODO : CHANGE
                                        role = "Sponsor";
                                        break;
                                    case 6:
                                        color = new rgb(217, 83, 26); // Red-orange
                                        role = "Jury";
                                        role_phase = 5;
                                        break;
                                    case 7:
                                        color = new rgb(202, 188, 73); // Caqui
                                        role = "Media";
                                        role_phase = 5;
                                        break;
                                    case 8:
                                        color = new rgb(128, 0, 52); // Fuchsia
                                        role = "Audiovisuel";
                                        role_phase = -10;
                                        break;
                                    default:
                                        color = new rgb(0, 0, 0);
                                        role = "";
                                }

                                doc.setFillColor(color.r, color.g, color.b);
                                doc.rect(this.x, this.y + 42.5, 85, 12.5, 'F');
                                doc.setTextColor(0, 0, 0);
                                doc.setFontSize(28);
                                doc.text(this.x + 5, this.y + 27, this.fname.toUpperCase());
                                doc.setTextColor(color.r, color.g, color.b);
                                doc.setFontSize(20);
                                if (this.lname.length > 15)
                                    doc.setFontSize(16.5);
                                doc.text(this.x + 5, this.y + 35, this.lname.toUpperCase());
                                doc.setTextColor(255, 255, 255);
                                doc.setFontSize(13);
                                doc.text(this.x + 65 + role_phase, this.y + 50.4, role);
                                doc.addImage(LOGOS.HACKLYON, 'PNG', this.x + 5, this.y + 45, 24, 7);


                                this.x = this.x + 85;
                                // BACK
                                doc.addImage(LOGOS.TWITTER, 'PNG', this.x + 5, this.y + 6.875, 5, 5);
                                doc.addImage(LOGOS.INSTAGRAM, 'PNG', this.x + 5, this.y + 18.75, 5, 5);
                                doc.addImage(LOGOS.FACEBOOK, 'PNG', this.x + 5, this.y + 30.625, 5, 5);
                                doc.setTextColor(color.r, color.g, color.b);
                                doc.text(this.x + 12, this.y + 4 + 6.875, "@hacklyon");
                                doc.text(this.x + 12, this.y + 4 + 18.75, "hacklyon");
                                doc.text(this.x + 12, this.y + 4 + 30.625, "fb.com/hacklyonfr");

                                doc.setFillColor(color.r, color.g, color.b);
                                doc.rect(this.x, this.y + 42.5, 85, 12.5, 'F');
                                doc.setTextColor(255, 255, 255);
                                doc.setFontSize(18);
                                doc.text(this.x + 22, this.y + 51, "#hacklyon2018");
                            }
                        }

                        for (let i = 0; i < confirmed.length; i++) {
                            let user = confirmed[i];
                            let index = i % 5;
                            let phase = 0; //1.5
                            let r = new Rect(user, index, index * phase);

                            r.draw();

                            if ((i + 1) % 5 === 0 && (i + 1) !== confirmed.length) {
                                doc.addPage();
                            }
                        }

                        doc.save("HackLyon Badges " + new Date().toDateString() + ".pdf");

                    });
            };

            $scope.exportCSV = function () {
                UserService
                    .getAll()
                    .success(function (data) {

                        //var output = '"sep=;"\n"';
                        let output = '';
                        let titles = generateSections(data[0]);
                        for (let i = 0; i < titles.length; i++) {
                            for (let j = 0; j < titles[i].fields.length; j++) {
                                if (j === titles[i].fields.length) {
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
                            for (i = 0; i < row.length; i++) {
                                for (j = 0; j < row[i].fields.length; j++) {
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
            };

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
                                name: 'firstname',
                                value: user.profile.firstName
                            }, {
                                name: 'lastname',
                                value: user.profile.lastName
                            }, {
                                name: 'email',
                                value: user.email
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
                                name: 'essay',
                                value: user.profile.essay
                            }, {
                                name: 'notes',
                                value: user.profile.suggestion
                            }, {
                                name: 'phone',
                                value: user.confirmation.phoneNumber
                            }
                        ]
                    }
                ];
            }

            $scope.selectUser = selectUser;

        }])
;