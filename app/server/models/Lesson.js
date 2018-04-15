const mongoose = require('mongoose');
const validator = require('validator');

mongoose.Promise = global.Promise;
UserSchema = require('./User');

/**
 * Lessons Schema!
 *
 * Fields with select: false are not public.
 * These can be retrieved in controller methods.
 *
 * @type {mongoose}
 */
let schema = new mongoose.Schema({
    title: String,
    description: String,
    content: String,
    users: [ {type : mongoose.Schema.ObjectId, ref: 'User'} ],
    order: { type: Number, default: 99},
    done: { type: Boolean, default: false}
});

module.exports = mongoose.model('Lesson', schema);