angular.module('reg')
    .factory('LessonsService', [
        '$http',
        'Session',
        function ($http, Session) {

            const lessons = '/api/lessons';
            const base = lessons + '/';

            return {

                // ----------------------
                // Basic Actions
                // ----------------------
                getCurrentUser: function () {
                    return $http.get(base + Session.getUserId());
                },

                get: function (id) {
                    return $http.get(base + id);
                },

                getAll: function () {
                    return $http.get(base);
                },

                getPage: function (page, size, text, statusFilters) {
                    return $http.get(users + '?' + $.param(
                        {
                            text: text,
                            page: page ? page : 0,
                            size: size ? size : 100,
                            statusFilters: statusFilters ? statusFilters : {}
                        })
                    );
                },

                updateLesson: function (lesson) {
                    return $http.put(base + lesson._id, {
                        lesson: lesson
                    });
                },

                createLesson: function (lesson) {
                    return $http.post(base, {lesson: lesson});
                },


                markCompleted: function (id) {
                    return $http.put(base + id + "/completed");
                },

                markUncompleted: function (id) {
                    return $http.put(base + id + "/uncompleted");
                },

                updateConfirmation: function (id, confirmation) {
                    return $http.put(base + id + '/confirm', {
                        confirmation: confirmation
                    });
                },

                declineAdmission: function (id) {
                    return $http.post(base + id + '/decline');
                },


            };
        }
    ]);
