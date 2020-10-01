const mongoose = require('mongoose');

const skillSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    content: { type: String, required: true },
    skillImage: { type: String, required: true }
});

module.exports = mongoose.model('Skill', skillSchema);