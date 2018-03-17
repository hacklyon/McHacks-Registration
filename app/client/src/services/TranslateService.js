app.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '/assets/i18n/{part}/{lang}.json'
    });

    $translateProvider.preferredLanguage('fr');
}]);