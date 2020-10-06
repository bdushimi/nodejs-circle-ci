let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//skill schema definition
let SkillSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    skillImage: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },    
  }, 
  { 
    versionKey: false
  }
);

// Sets the createdAt parameter equal to the current time
SkillSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

//Exports the SkillSchema for use elsewhere.
module.exports = mongoose.model('skill', SkillSchema);