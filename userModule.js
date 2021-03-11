const mod = mongoose.model(
    "user",
    new Schema({
     
      email: { type: String, required: true },
      pass: { type: String, required: true }
     
    })
  );
  module.exports = mod;