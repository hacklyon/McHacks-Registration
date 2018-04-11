angular.module('reg')
    .factory('LessonsService', [
        '$http',
        'Session',
        function($http, Session){

            const lessons = '/api/lessons';
            const base = lessons + '/';

            return {

                // ----------------------
                // Basic Actions
                // ----------------------
                getCurrentUser: function(){
                    return $http.get(base + Session.getUserId());
                },

                get: function(id){
                    return $http.get(base + id);
                },

                getAll: function(){
                    return $http.get(base);
                },

                getPage: function(page, size, text, statusFilters){
                    return $http.get(users + '?' + $.param(
                        {
                            text: text,
                            page: page ? page : 0,
                            size: size ? size : 100,
                            statusFilters: statusFilters ? statusFilters : {}
                        })
                    );
                },

                updateLesson: function(lesson){
                    return $http.put(base + lesson._id, {
                        lesson: lesson
                    });
                },

                createLesson: function(lesson){
                    return $http.post(base, lesson);
                },

                updateConfirmation: function(id, confirmation){
                    return $http.put(base + id + '/confirm', {
                        confirmation: confirmation
                    });
                },

                declineAdmission: function(id){
                    return $http.post(base + id + '/decline');
                },

                // ------------------------
                // Team
                // ------------------------
                joinOrCreateTeam: function(code){
                    return $http.put(base + Session.getUserId() + '/team', {
                        code: code
                    });
                },

                leaveTeam: function(){
                    return $http.delete(base + Session.getUserId() + '/team');
                },

                getMyTeammates: function(){
                    return $http.get(base + Session.getUserId() + '/team');
                },

                // -------------------------
                // Admin Only
                // -------------------------

                getStats: function(){
                    return $http.get(base + 'stats');
                },

                admitUser: function(id){
                    return $http.post(base + id + '/admit');
                },

                checkIn: function(id){
                    return $http.post(base + id + '/checkin');
                },

                checkOut: function(id){
                    return $http.post(base + id + '/checkout');
                },
                makeAdmin: function(id){
                    return $http.post(base + id + '/makeadmin');
                },

                removeAdmin: function(id){
                    return $http.post(base + id + '/removeadmin');
                },

                sendLaggerEmails: function() {
                    return $http.post(base + 'sendlagemails');
                },
                sendAcceptEmails: function() {
                    return $http.post(base + 'sendacceptemails');
                },
            };
        }
    ]);
