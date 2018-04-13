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

            $scope.lessons = {};

            LessonsService
                .getAll()
                .success(function (lessons) {
                    $scope.lessons = lessons;
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

                if (!lesson.content) {
                    $window.location.href = lesson.link;
                } else {
                    $state.go('app.lesson', {
                        id: lesson._id
                    });
                }
            };


        }]);