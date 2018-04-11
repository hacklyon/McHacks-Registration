let Lesson = require('../models/Lesson');

let LessonController = {};

/**
 * Get all users.
 * It's going to be a lot of data, so make sure you want to do this.
 * @param  {Function} callback args(err, user)
 */
LessonController.getAll = function (callback) {
    Lesson.find({}).sort({ order: 1 }).exec(callback);
};

/**
 * Create a new lesson given a title, a description and a link.
 * @param  {String}   title Lesson's title.
 * @param  {String}   description [description]
 * @param  {String}   link [description]
 * @param  {Number}   order [description]
 * @param  {Function} callback args(err, user)
 */
LessonController.createLesson = function (lesson, callback) {
    let l = new Lesson();
    l.title = lesson.title;
    l.description = lesson.description;
    l.link = lesson.link;
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

LessonController.updateLesson = function(lesson, callback) {
    Lesson.findByIdAndUpdate(lesson._id, lesson, {new: true},callback);
};

module.exports = LessonController;