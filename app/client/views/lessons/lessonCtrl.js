angular.module('reg')
    .controller('LessonCtrl', [
        '$scope',
        '$sce',
        '$rootScope',
        '$state',
        'currentUser',
        'Lesson',
        'LessonsService',
        '$translate',
        '$translatePartialLoader',
        'Utils',
        'UserService',
        function ($scope, $sce, $rootScope, $state, currentUser, Lesson, LessonsService, $translate, $translatePartialLoader, Utils, UserService) {

            $translatePartialLoader.addPart('lesson');
            $translatePartialLoader.addPart('sidebar');
            $translate.refresh();

            // Set up the user
            let user = currentUser.data;
            let lesson = Lesson.data;
            $scope.lesson = lesson;
            $scope.user = user;

            $scope.isMale = function () {
                return user.profile.gender === 'M';
            };
            $scope.isFemale = function () {
                return user.profile.gender === 'F';
            };
            $scope.isOther = function () {
                return user.profile.gender !== 'M' && user.profile.gender !== 'F';
            };

            let converter = new showdown.Converter();
            $scope.content = $sce.trustAsHtml(converter.makeHtml(lesson.content));

        }]);