angular.module('reg')
    .controller('ApplicationCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        '$http',
        '$window',
        'currentUser',
        'settings',
        'Session',
        'Utils',
        'UserService',
        function ($scope, $rootScope, $state, $http, $window, currentUser, Settings, Session, Utils, UserService) {

            // Set up the user
            $scope.user = currentUser.data;
            $scope.timeStart = Settings.data.timeStart;
            $scope.formatDate = function(time){

                if (!time){
                    return "Invalid Date";
                }

                date = new Date(time);
                // Hack for timezone
                return moment(date).format('MMMM Do YYYY') + "";

            };

            $scope.submitButtonDisabled = true;

            var dropzoneConfig = {
                url: '/api/resume/upload',
                previewTemplate: document.querySelector('#resume-dropzone-preview').innerHTML,
                maxFiles: 1,
                maxFilesize: 2, // MB
                uploadMultiple: false,
                acceptedFiles: 'application/pdf',
                autoProcessQueue: false,
                clickable: ['.resume-dropzone', '.resume-dropzone>span'],
                headers: {
                    'x-access-token': Session.getToken()
                }
            };

            $scope.showResumeDropzoneIcon = true;
            $scope.resumeDropzoneErrorMessage = '';
            $scope.showResumeDropzone = false;

            $scope.resumeDropzone = new Dropzone('div#resume-upload', dropzoneConfig);

            $scope.resumeDropzone.on("error", function (file, errorMessage) {
                $scope.resumeDropzoneHasError = true;
                $scope.resumeDropzoneErrorMessage = errorMessage;
                $scope.$apply();
            });

            $scope.resumeDropzone.on("addedfile", function () {
                if ($scope.resumeDropzone.files.length > 1) {
                    $scope.resumeDropzone.removeFile($scope.resumeDropzone.files[0]);
                }

                $scope.resumeDropzoneHasError = false;
                $scope.resumeDropzoneErrorMessage = '';
                $scope.showResumeDropzoneIcon = !!!$scope.resumeDropzone.files.length;
                $scope.submitButtonDisabled = false;
                $scope.$apply();
            })

            $scope.resumeDropzone.on("removedfile", function () {
                $scope.resumeDropzoneHasError = false;
                $scope.resumeDropzoneErrorMessage = '';
                $scope.showResumeDropzoneIcon = !!!$scope.resumeDropzone.files.length;
                $scope.$apply();
            })

            $scope.resumeDropzone.on("processing", function () {
                $scope.resumeDropzoneIsUploading = true;
            })

            $scope.toggleResumeDropzone = function () {
                $scope.showResumeDropzone = !$scope.showResumeDropzone;
            }

            // Is the student from McGill?
            $scope.isINSAStudent = $scope.user.email.split('@')[1] === 'insa-lyon.fr';

            // If so, default them to adult: true
            if ($scope.isINSAStudent) {
                $scope.user.profile.adult = true;
            }

            $scope.$watch('user', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.submitButtonDisabled = false;
                }
            }, true);

            // Populate the school dropdown
            populateSchools();
            populateDisciplines();
            _setupForm();

            $scope.regIsClosed = Date.now() > Settings.data.timeClose;

            /**
             * TODO: JANK WARNING
             */
            function populateSchools() {
                $http
                    .get('/assets/schools.json')
                    .then(function (res) {
                        const schools = res.data;
                        const email = $scope.user.email.split('@')[1];

                        if (schools[email]) {
                            $scope.user.profile.school = schools[email].school;
                            $scope.autoFilledSchool = true;
                        }
                    });

                $http
                    .get('/assets/schools.csv')
                    .then(function (res) {
                        $scope.schools = res.data.split('\n');
                        $scope.schools.push('Other');

                        let content = [];

                        for (i = 0; i < $scope.schools.length; i++) {
                            $scope.schools[i] = $scope.schools[i].trim();
                            content.push({title: $scope.schools[i]})
                        }

                        $('#school.ui.search')
                            .search({
                                source: content,
                                cache: true,
                                onSelect: function (result, response) {
                                    $scope.user.profile.school = result.title.trim();
                                }
                            })
                    });
            }

            function populateDisciplines() {
                $http
                    .get('/assets/disciplines.csv')
                    .then(function (res) {
                        $scope.disciplines = res.data.split('\n');
                        $scope.disciplines.push('Other');

                        let content = [];

                        for (i = 0; i < $scope.disciplines.length; i++) {
                            $scope.disciplines[i] = $scope.disciplines[i].trim();
                            content.push({title: $scope.disciplines[i]})
                        }

                        $('#discipline.ui.search')
                            .search({
                                source: content,
                                cache: true,
                                onSelect: function (result, response) {
                                    $scope.user.profile.discipline = result.title.trim();
                                }
                            })
                    });
            }

            function _successModal() {
                sweetAlert({
                    title: "Done!",
                    text: "Your application has been saved.",
                    type: "success",
                    showConfirmButton: false,
                    timer: 1500
                }, function () {
                    swal.close();
                    $state.go('app.dashboard');
                });
            }

            function _updateUser(e) {
                UserService
                    .updateProfile(Session.getUserId(), $scope.user.profile)
                    .success(function (data) {
                        if ($scope.resumeDropzone.files.length) {
                            $scope.resumeDropzone.processQueue();
                            $scope.resumeDropzone.on('queuecomplete', _successModal);
                        } else {
                            _successModal();
                        }
                    })
                    .error(function (res) {
                        sweetAlert("Uh oh!", "Something went wrong.", "error");
                        $scope.submitButtonDisabled = false;
                    });
            }

            function isMinor() {
                return !$scope.user.profile.adult;
            }

            function minorsAreAllowed() {
                return Settings.data.allowMinors;
            }

            function minorsValidation() {
                // Are minors allowed to register?
                return !(isMinor() && !minorsAreAllowed());

            }

            function _setupForm() {
                // Custom minors validation rule
                $.fn.form.settings.rules.allowMinors = function (value) {
                    return minorsValidation();
                };

                // Semantic-UI form validation
                $('.ui.form').form({
                    fields: {
                        name: {
                            identifier: 'name',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter your name.'
                                }
                            ]
                        },
                        school: {
                            identifier: 'school',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter your school name.'
                                }
                            ]
                        },
                        graduationYear: {
                            identifier: 'graduationYear',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please select your graduation year.'
                                }
                            ]
                        },
                        dietaryRestrictions: {
                            identifier: 'dietaryRestrictions',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please select your option.'
                                }
                            ]
                        },
                        gender: {
                            identifier: 'gender',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please select a gender.'
                                }
                            ]
                        },
                        resume: {
                            identifier: 'resume',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter link to your resume.'
                                }
                            ]
                        },
                        degree: {
                            identifier: 'degree',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please select your degree pursuing.'
                                }
                            ]
                        },
                        discipline: {
                            identifier: 'discipline',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please enter your major.'
                                }
                            ]
                        },
                        shirtSize: {
                            identifier: 'shirtSize',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please give us a shirt size!'
                                }
                            ]
                        },
                        travel: {
                            identifier: 'travel',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please give your travel origin.'
                                }
                            ]
                        },
                        job: {
                            identifier: 'job',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Please select one option.'
                                }
                            ]
                        },
                        mlhcodeconduct: {
                            identifier: 'mlhcodeconduct',
                            rules: [
                                {
                                    type: 'checked',
                                    prompt: 'You must accept the code of conduct.'
                                }
                            ]
                        }
                    },
                });
            }

            $scope.openResume = function () {
                const id = Session.getUserId();
                let resumeWindow = $window.open('', '_blank');
                $http
                    .get('/api/resume/' + id)
                    .then(function (response) {
                        resumeWindow.location.href = '/api/resume/view/' + response.data.token;
                    })
            };

            $scope.submitForm = function () {
                if ($('.ui.form').form('is valid')) {
                    _updateUser();
                }
            };
        }]);