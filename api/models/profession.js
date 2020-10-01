const mongoose = require('mongoose');

const professionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    welcomeMessage: { type: String, required: true },
    professionTitle: { type: String, required: true },
    professionImage: { type: String, required: true }
});

module.exports = mongoose.model('Profession', professionSchema);