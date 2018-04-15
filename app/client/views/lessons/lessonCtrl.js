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
            $translatePartialLoader.addPart('lessons');
            $translatePartialLoader.addPart('sidebar');
            $translate.refresh();

            // Set up the user
            let user = currentUser.data;
            $scope.values = {
                name: user.profile.name,
                discipline: user.profile.discipline,
                school: user.profile.school
            };
            let lesson = Lesson.data;
            $scope.lesson = lesson;
            $scope.user = user;
            $scope.next = {end:false};
            $scope.prev = {end:false};

            $scope.lessons = {};

            LessonsService
                .getAll()
                .success(function (lessons) {
                    $scope.lessons = lessons;
                    for(let i=0; i< lessons.length;i++) {
                        if (lessons[i]._id === lesson._id) { // found
                            if(i>0) {
                                $scope.prev.lesson = lessons[i-1];
                            } else {
                                $scope.prev.end = true;
                                $scope.prev.lesson = {title: "LESSONS"};
                            }

                            if(i<lessons.length-1) {
                                $scope.next.lesson = lessons[i+1];
                            } else {
                                $scope.next.end = true;
                                $scope.next.lesson = {title: "LESSONS"};
                            }

                            break;
                        }
                    }
                });

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


            $scope.goPrev = function($event) {
                if($scope.prev.end) {
                    $state.go('app.lessons', {});
                } else {
                    $state.go('app.lesson', {
                        id: $scope.prev.lesson._id
                    });
                }
            };
            $scope.goNext = function ($event) {
                LessonsService.markCompleted($scope.lesson._id);
                if($scope.next.end) {
                    $state.go('app.lessons', {});
                } else {
                    $state.go('app.lesson', {
                        id: $scope.next.lesson._id
                    });
                }
            };

            $scope.goToUrl = function (short) {
                console.log(short);
                var link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
                link.href = 'http://www.google.com';
                link.target = '_blank';
                var event = new MouseEvent('click', {
                    'view': window,
                    'bubbles': false,
                    'cancelable': true
                });
                link.dispatchEvent(event);
            };

            $scope.$on('$viewContentLoaded', function () {
                setTimeout(function () {
                    $("#user_lessons_progress").progress({
                        label: 'ratio',
                        text: {
                            ratio: '{value} de {total}'
                        }
                    });

                    $("#content a").each(function (index, elem) {
                        elem.target = "_blank";
                        elem.href = elem.href + '?u=' + $scope.user._id;
                        console.log(elem);
                    })
                }, 1000);
            });
        }]);