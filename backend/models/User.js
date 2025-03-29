const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer'
  },
  walletAddress: {
    type: String,
    required: function() { return this.role === 'buyer'; },
    validate: {
      validator: function(v) {
        return this.role !== 'buyer' || /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: props => `Invalid Ethereum address for buyer role: ${props.value}`
    }
  },
  bankDetails: {
    type: {
      accountNumber: { type: String, required: function() { return this.role === 'seller'; } },
      ifscCode: { type: String, required: function() { return this.role === 'seller'; } },
      bankName: { type: String, required: function() { return this.role === 'seller'; } }
    },
    required: function() { return this.role === 'seller'; }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);