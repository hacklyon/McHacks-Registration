angular.module('reg')
    .controller('SidebarCtrl', [
        '$rootScope',
        '$scope',
        '$state',
        'settings',
        'Utils',
        'AuthService',
        'Session',
        'EVENT_INFO',
        function ($rootScope, $scope, $state, Settings, Utils, AuthService, Session, EVENT_INFO) {
            var transparentNavbarViews = ['app.home', 'app.login', 'app.sponsor', 'app.mentor', 'app.recruit', 'app.logistics', 'app.corporate', 'app.marketing', 'app.technology']
            var liveViews = ['app.live', 'app.schedule', 'app.expo']
            var hackViews = ['app.recruit', 'app.logistics', 'app.corporate', 'app.marketing', 'app.technology']

            var settings = Settings.data;
            var user = $rootScope.currentUser;

            $scope.EVENT_INFO = EVENT_INFO;

            $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);

            $scope.logout = function () {
                AuthService.logout();
            };

            $scope.showSidebar = false;
            $scope.toggleSidebar = function () {
                $scope.showSidebar = !$scope.showSidebar;
            };

            // oh god jQuery hack
            $('.item').on('click', function () {
                $scope.showSidebar = false;
            });

        }]);
