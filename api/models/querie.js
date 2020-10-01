const mongoose = require('mongoose');

const querieSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    names: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true }
});

module.exports = mongoose.model('Querie', querieSchema);