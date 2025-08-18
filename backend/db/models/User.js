import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
  },
  school_year: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true
  },
  school_type: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  register_date: {
    type: Date,
    default: Date.now
  },
  isAdm: {
    type: Boolean,
    required: true
  },
});

const User = models.User || model('User', UserSchema);

export default User;