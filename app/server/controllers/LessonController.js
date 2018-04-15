let Lesson = require('../models/Lesson');
let User = require('../models/User');

let LessonController = {};

/**
 * Get all users.
 * It's going to be a lot of data, so make sure you want to do this.
 * @param  {Function} callback args(err, user)
 */
LessonController.getAll = function (callback) {
    Lesson.find({}).sort({order: 1}).exec(callback);
};

/**
 * Get a lesson by id.
 * @param  {String}   id       Lesson id
 * @param  {Function} callback args(err, user)
 */
LessonController.getById = function (id, callback) {
    Lesson.findById(id, callback);
};

/**
 * Create a new lesson given a title, a description and a link.
 * @param  {String}   lesson Lesson object.
 * @param  {Function} callback args(err, user)
 */
LessonController.createLesson = function (lesson, callback) {
    let l = new Lesson();
    l.title = lesson.title;
    l.description = lesson.description;
    l.content = lesson.content;
    l.order = lesson.order;
    l.save(function (err) {
        if (err) {
            return callback({
                message: "An error came up when creating the lesson. :/"
            });
        } else {
            // yay! success.

            return callback(
                null,
                {
                    lesson: l
                }
            );
        }
    });
};

LessonController.updateLesson = function (lesson, callback) {
    Lesson.findByIdAndUpdate(lesson._id, lesson, {new: true}, callback);
};

LessonController.markCompleted = function (id, user, callback) {
    Lesson.findByIdAndUpdate(id,
        {$push: {users: user}},
        {safe: true, upsert: true},
        function (err, doc) {
            if (err) {
                return callback({
                    message: "An error came up when marking the lesson completed. :/"
                });
            } else {
                User.findByIdAndUpdate(user._id,
                    {$push: {lessons: doc}},
                    {sfe: true, upsert: true},
                    callback
                );
            }
        }
    );
};

LessonController.markUncompleted = function (id, user, callback) {

    Lesson
        .findById(id)
        .exec(function (err, l) {
            if(err) {
                return callback({
                    message: "An error came up when marking the lesson uncompleted. :/"
                });
            }
            console.log("error:");
            console.log(err);
            console.log("lesson:");
            console.log(l);
            l.users.pull(user._id);
            l.save();
        });

    User
        .findById(user._id)
        .exec(function(err, u) {
            if(err) {
                return callback({
                    message: "An error came up when marking the lesson uncompleted. :/"
                });
            }
            console.log("error:");
            console.log(err);
            console.log("user:");
            console.log(u);
            u.lessons.pull(id);
            u.save();
        });

    return callback(null, {message: "Marked uncompleted"});
};

module.exports = LessonController;