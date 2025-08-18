import { Schema, model, models } from 'mongoose';

const GameProgressSchema = new Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userScore: {
    type: Number,
    required: false,
  },
  userMistakes: {
    type: Number,
    required: true,
  },
  datePlayed: {
    type: Date,
    default: Date.now,
  },
});

const GameProgress = models.GameProgress || model('GameProgress', GameProgressSchema);

export default GameProgress;