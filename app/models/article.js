let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//article schema definition
let ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    articleImage: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },    
  }, 
  { 
    versionKey: false
  }
);

// Sets the createdAt parameter equal to the current time
ArticleSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

//Exports the ArticleSchema for use elsewhere.
module.exports = mongoose.model('article', ArticleSchema);