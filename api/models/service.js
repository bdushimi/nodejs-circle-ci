const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    content: { type: String, required: true },
    serviceImage: { type: String, required: true }
});

module.exports = mongoose.model('Service', serviceSchema);