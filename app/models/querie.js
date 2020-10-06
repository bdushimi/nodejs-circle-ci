let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//querie schema definition
let QuerieSchema = new Schema(
  {
    names: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },    
  }, 
  { 
    versionKey: false
  }
);

// Sets the createdAt parameter equal to the current time
QuerieSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

//Exports the QuerieSchema for use elsewhere.
module.exports = mongoose.model('querie', QuerieSchema);