angular.module('reg')
    .controller('ThanksCtrl', [
        '$scope',
        '$stateParams',
        '$translate',
        '$translatePartialLoader',
        function ($scope, $stateParams, $translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('sidebar');
            $translate.refresh();
        }]);
