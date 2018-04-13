app.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '/assets/i18n/{part}/{lang}.json'
    });

    let browser_langs = window.navigator.languages;
    let found = false;
    if (!browser_langs) {
        browser_langs = [];
        browser_langs.push(window.navigator.language);
    }
    browser_langs.forEach(function (browser_lang) {
        if(!found) {
            let lang = browser_lang.substr(0, 2);
            if (["en", "fr"].includes(lang)) {
                found = true;
                $translateProvider.preferredLanguage(lang);
                moment.locale(lang);
            }
        }
    });
    if (!found) $translateProvider.preferredLanguage('fr');
}]);
