import { Schema, model, models } from 'mongoose';

const AdmSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  register_date: {
    type: Date,
    default: Date.now
  }
});

const Adm = models.Adm || model('Adm', AdmSchema);

export default Adm;