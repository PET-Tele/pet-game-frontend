import { Schema, model, models } from 'mongoose';

const GameSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  picture: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  videosList: {
    type: [String],
    required: false,
  }
});

const Game = models.Game || model('Game', GameSchema);

export default Game;