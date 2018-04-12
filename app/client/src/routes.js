angular.module('reg')
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        function ($stateProvider,
                  $urlRouterProvider,
                  $locationProvider) {

            // For any unmatched url, redirect to /state1
            $urlRouterProvider.otherwise("/404");

            // Set up de states
            $stateProvider
                .state('app', {
                    views: {
                        '': {
                            templateUrl: "views/base.html"
                        },
                        'sidebar@app': {
                            templateUrl: "views/sidebar/sidebar2.html",
                            controller: 'SidebarCtrl2',
                            resolve: {
                                'settings': function (SettingsService) {
                                    return SettingsService.getPublicSettings();
                                }
                            }
                        }
                    },
                    data: {
                        requireLogin: true
                    }
                })
                .state('app.home', {
                    url: "/",
                    templateUrl: "views/home/home.html",
                    controller: 'HomeCtrl',
                    data: {
                        requireLogin: false
                    },
                    resolve: {
                        'settings': function (SettingsService) {
                            return SettingsService.getPublicSettings();
                        }
                    }
                })
                .state('app.login', {
                    url: "/login",
                    templateUrl: "views/login/login.html",
                    controller: 'LoginCtrl',
                    data: {
                        requireLogin: false
                    },
                    resolve: {
                        'settings': function (SettingsService) {
                            return SettingsService.getPublicSettings();
                        }
                    }
                })
                .state('app.dashboard', {
                    url: "/dashboard",
                    templateUrl: "views/dashboard/dashboard.html",
                    controller: 'DashboardCtrl',
                    resolve: {
                        currentUser: function (UserService) {
                            return UserService.getCurrentUser();
                        },
                        settings: function (SettingsService) {
                            return SettingsService.getPublicSettings();
                        }
                    },
                })
                .state('app.application', {
                    url: "/application",
                    templateUrl: "views/application/application.html",
                    controller: 'ApplicationCtrl',
                    data: {
                        requireVerified: true
                    },
                    resolve: {
                        currentUser: function (UserService) {
                            return UserService.getCurrentUser();
                        },
                        settings: function (SettingsService) {
                            return SettingsService.getPublicSettings();
                        }
                    }

                })
                .state('app.confirmation', {
                    url: "/confirmation",
                    templateUrl: "views/confirmation/confirmation.html",
                    controller: 'ConfirmationCtrl',
                    data: {
                        requireAdmitted: true
                    },
                    resolve: {
                        currentUser: function (UserService) {
                            return UserService.getCurrentUser();
                        }
                    }
                })
                .state('app.lessons', {
                    url: "/lessons",
                    templateUrl: "views/lessons/lessons.html",
                    controller: 'LessonsCtrl',
                    data: {
                        requireConfirmedorAdmin: true
                    },
                    resolve: {
                        currentUser: function (UserService) {
                            return UserService.getCurrentUser();
                        }
                    }
                })
                .state('app.lesson', {
                    url: "/lessons/:id",
                    templateUrl: "views/lessons/lesson.html",
                    controller: 'LessonCtrl',
                    data: {
                        requireConfirmedorAdmin: true
                    },
                    resolve: {
                        Lesson: function ($stateParams, LessonsService) {
                            return LessonsService.get($stateParams.id);
                        },
                        currentUser: function (UserService) {
                            return UserService.getCurrentUser();
                        }
                    }
                })
                .state('app.team', {
                    url: "/team",
                    templateUrl: "views/team/team.html",
                    controller: 'TeamCtrl',
                    data: {
                        requireVerified: true,
                        requireCompletedProfile: true
                    },
                    resolve: {
                        currentUser: function (UserService) {
                            return UserService.getCurrentUser();
                        },
                        settings: function (SettingsService) {
                            return SettingsService.getPublicSettings();
                        }
                    }
                })
                .state('app.admin', {
                    views: {
                        '': {
                            templateUrl: "views/admin/admin.html",
                            controller: 'AdminCtrl'
                        }
                    },
                    data: {
                        requireAdmin: true
                    }
                })
                .state('app.admin.stats', {
                    url: "/admin",
                    templateUrl: "views/admin/stats/stats.html",
                    controller: 'AdminStatsCtrl'
                })
                .state('app.admin.users', {
                    url: "/admin/users?" +
                    '&page' +
                    '&size' +
                    '&query',
                    templateUrl: "views/admin/users/users.html",
                    controller: 'AdminUsersCtrl'
                })
                .state('app.admin.user', {
                    url: "/admin/users/:id",
                    templateUrl: "views/admin/user/user.html",
                    controller: 'AdminUserCtrl',
                    resolve: {
                        'user': function ($stateParams, UserService) {
                            return UserService.get($stateParams.id);
                        }
                    }
                })
                .state('app.admin.settings', {
                    url: "/admin/settings",
                    templateUrl: "views/admin/settings/settings.html",
                    controller: 'AdminSettingsCtrl',
                })
                .state('app.admin.lessons',{
                    url: "/admin/lessons",
                    templateUrl: "views/admin/lessons/lessons.html",
                    controller: 'AdminLessonsCtrl'
                })
                .state('reset', {
                    url: "/reset/:token",
                    templateUrl: "views/reset/reset.html",
                    controller: 'ResetCtrl',
                    data: {
                        requireLogin: false
                    }
                })
                .state('verify', {
                    url: "/verify/:token",
                    templateUrl: "views/verify/verify.html",
                    controller: 'VerifyCtrl',
                    data: {
                        requireLogin: false
                    }
                })
                .state('404', {
                    url: "/404",
                    templateUrl: "views/404.html",
                    data: {
                        requireLogin: false
                    }
                });

            $locationProvider.html5Mode({
                enabled: true,
            });

        }])
    .run([
        '$rootScope',
        '$state',
        '$timeout',
        '$window',
        'Session',
        function(
            $rootScope,
            $state,
            $timeout,
            $window,
            Session ){

            $rootScope.$on('$stateChangeSuccess', function() {
                $rootScope.fadeOut = false;
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            });

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
                if (toState.external) {
                    event.preventDefault();
                    $window.open(toState.redirectTo, '_self');
                }

                var requireLogin = toState.data.requireLogin;
                var requireAdmin = toState.data.requireAdmin;
                var requireVerified = toState.data.requireVerified;
                var requireAdmitted = toState.data.requireAdmitted;
                var requireOwner = toState.data.requireOwner;
                var requireConfirmed = toState.data.requireConfirmed;
                let requireConfirmedorAdmin = toState.data.requireConfirmedorAdmin;
                $rootScope.fromState = fromState;

                if (toState.redirectTo) {
                    event.preventDefault();
                    $state.go(toState.redirectTo, toParams, {location: 'replace'})
                }

                if (!$rootScope.fadeOut) {
                    event.preventDefault();
                    $rootScope.fadeOut = true;

                    $timeout(function() {
                        $state.go(toState.name, toParams);
                    }, 100);
                }

                if (requireLogin && !Session.getToken()) {
                    event.preventDefault();
                    $state.go('app.login');
                }

                if (requireAdmin && !Session.getUser().admin) {
                    event.preventDefault();
                    $state.go('app.dashboard');
                }

                if (requireOwner && !Session.getUser().owner) {
                    event.preventDefault();
                    $state.go('app.checkin');
                }

                if (requireVerified && !Session.getUser().verified) {
                    event.preventDefault();
                    $state.go('app.dashboard');
                }

                if (requireAdmitted && !Session.getUser().status.admitted) {
                    event.preventDefault();
                    $state.go('app.dashboard');
                }

                if (requireConfirmed && !Session.getUser().status.confirmed) {
                    event.preventDefault();
                    $state.go('app.dashboard');
                }

                if (requireConfirmedorAdmin && !Session.getUser().status.confirmed) {
                    event.preventDefault();
                    $state.go('app.dashboard');
                }

                if (toState.name === 'app.apply' && Session.getUserId()) {
                    event.preventDefault();
                    $state.go('app.application');
                }

                if (toState.name === 'app.volunteer') {
                    event.preventDefault();
                    $state.go('app.home');
                }

                if (toState.name === 'app.live') {
                    event.preventDefault();
                    $state.go('app.expo');
                }

            });

        }]);