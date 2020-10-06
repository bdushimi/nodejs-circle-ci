let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//profession schema definition
let ProfessionSchema = new Schema(
  {
    welcomeMessage: { type: String, required: true },
    professionTitle: { type: String, required: true },
    professionImage: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },    
  }, 
  { 
    versionKey: false
  }
);

// Sets the createdAt parameter equal to the current time
ProfessionSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

//Exports the ProfessionSchema for use elsewhere.
module.exports = mongoose.model('profession', ProfessionSchema);