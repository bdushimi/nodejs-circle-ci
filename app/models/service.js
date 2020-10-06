let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//service schema definition
let ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    serviceImage: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },    
  }, 
  { 
    versionKey: false
  }
);

// Sets the createdAt parameter equal to the current time
ServiceSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

//Exports the ServiceSchema for use elsewhere.
module.exports = mongoose.model('service', ServiceSchema);