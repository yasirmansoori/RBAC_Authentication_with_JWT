const mongoose = require('mongoose');

const invalidatedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  invalidated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InvalidatedToken', invalidatedTokenSchema);
