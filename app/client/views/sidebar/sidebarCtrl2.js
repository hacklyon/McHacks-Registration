angular.module('reg')
    .controller('SidebarCtrl2', [
        '$rootScope',
        '$scope',
        '$state',
        'settings',
        'Utils',
        'AuthService',
        'Session',
        'EVENT_INFO',
        function ($rootScope, $scope, $state, settings, Utils, AuthService, Session, EVENT_INFO) {
            let transparentNavbarViews = ['app.home', 'app.login', 'app.sponsor', 'app.mentor', 'app.recruit', 'app.logistics', 'app.corporate', 'app.marketing', 'app.technology'];
            let liveViews = ['app.live', 'app.schedule', 'app.expo'];

            let Settings = settings.data;
            let user = $rootScope.currentUser;

            $scope.regIsOpen = Utils.isRegOpen(Settings);
            $scope.isEvent = Utils.isEvent(Settings);

            $scope.$watch(function(){
                return $state.$current.name
            }, function(newPath, oldPath){
                $scope.transparentNavbar = transparentNavbarViews.includes(newPath);

                $scope.showLiveNavbar = liveViews.includes(newPath);

                $scope.showCheckInNavbar = newPath === 'app.checkin';

                $scope.isLoggedIn = !!$rootScope.currentUser;

                if ($scope.isLoggedIn) {
                    let user = $rootScope.currentUser;

                    $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);

                    $scope.logout = function(){
                        AuthService.logout();
                    };
                }
            });


            $scope.EVENT_INFO = EVENT_INFO;

            $scope.logout = function () {
                AuthService.logout();
            };

            $scope.showSidebar = false;
            $scope.toggleSidebar = function () {
                $scope.showSidebar = !$scope.showSidebar;
            };

            $('.navbar-mobile-menu-icon').on('click', function() {
                $('.navbar-modal')
                    .modal('setting', 'transition', 'fade left')
                    .modal('show');
            });

            $('.navbar-mobile-menu-close-icon').on('click', function() {
                $('.ui.modal').modal('hide');
            });

            $scope.onMenuClick = function() {
                $('.ui.modal').modal('hide');
            };

            // oh god jQuery hack
            $('.item').on('click', function () {
                $scope.showSidebar = false;
            });

        }]);
