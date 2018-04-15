angular.module('reg')
    .controller('LessonsCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        '$window',
        'currentUser',
        'LessonsService',
        '$translate',
        '$translatePartialLoader',
        'Utils',
        'UserService',
        function ($scope, $rootScope, $state, $window, currentUser, LessonsService, $translate, $translatePartialLoader, Utils, UserService) {

            $translatePartialLoader.addPart('lessons');
            $translatePartialLoader.addPart('sidebar');
            $translate.refresh();

            // Set up the user
            let user = currentUser.data;
            $scope.user = user;

            $scope.values = {
                name: user.profile.name,
                discipline: user.profile.discipline,
                school: user.profile.school
            };

            $scope.lessons = {};

            LessonsService
                .getAll()
                .success(function (lessons) {
                    $scope.lessons = lessons;
                    $scope.lessons.forEach(function (lesson) {
                        if($scope.user.lessons.includes(lesson._id)) {
                            lesson.done = true;
                        }
                    });
                });

            $scope.pastConfirmation = Date.now() > user.status.confirmBy;

            $scope.formatTime = Utils.formatTime;

            $scope.isMale = function () {
                return user.profile.gender === 'M';
            };
            $scope.isFemale = function () {
                return user.profile.gender === 'F';
            };
            $scope.isOther = function () {
                return user.profile.gender !== 'M' && user.profile.gender !== 'F';
            };

            $scope.goLesson = function ($event, lesson) {
                $event.stopPropagation();

                $state.go('app.lesson', {
                    id: lesson._id
                });
            };

            $scope.markCompleted = function(lesson) {
                LessonsService
                    .markCompleted(lesson._id)
                    .success(function (data) {
                        lesson.done = true;
                        $scope.user.lessons.push(lesson._id);
                        updateProgress();
                    });
            };

            $scope.markUncompleted = function(lesson) {
                LessonsService
                    .markUncompleted(lesson._id)
                    .success(function (data) {
                        lesson.done = false;
                        $scope.user.lessons.pull(lesson._id);
                        updateProgress();
                    });
            };

            let updateProgress = function() {
                $('#user_lessons_progress').progress({
                    label: 'ratio',
                    text: {
                        ratio: '{value} de {total}'
                    },
                    percent: 100 * ($scope.user.lessons.length / $scope.lessons.length )
                });
            };

            $scope.$on('$viewContentLoaded', function () {
                setTimeout(function () {
                    updateProgress();
                }, 1000);
            });

        }]);