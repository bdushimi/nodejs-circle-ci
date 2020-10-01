const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    article_id: { 
        type: String, 
        required: true 
    },
    names: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    comment: { 
        type: String, 
        required: true 
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);