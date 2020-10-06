let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//comment schema definition
let CommentSchema = new Schema(
  {
    article_id: { type: String, required: true },
    names: { type: String, required: true },
    email: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },    
  }, 
  { 
    versionKey: false
  }
);

// Sets the createdAt parameter equal to the current time
CommentSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

//Exports the CommentSchema for use elsewhere.
module.exports = mongoose.model('comment', CommentSchema);