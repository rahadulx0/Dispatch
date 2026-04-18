const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['author', 'admin'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ROLES, default: 'author', index: true },
    bio: { type: String, maxlength: 500, default: '' },
    avatar: { type: String, default: '' },
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublic = function toPublic() {
  const { _id, name, email, role, bio, avatar, createdAt } = this;
  return { id: _id, name, email, role, bio, avatar, createdAt };
};

userSchema.statics.ROLES = ROLES;

module.exports = mongoose.model('User', userSchema);
