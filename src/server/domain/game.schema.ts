import { model, Schema, SchemaTypes } from 'mongoose';
import Game from '../../games/domain/game.js';

const gameSchema = new Schema<Game>({
  gameName: {
    type: String,
    required: true,
    unique: false,
  },
  category: {
    type: String,
    required: true,
    unique: false,
  },
  img: {
    type: String,
    required: true,
    unique: false,
  },
  releaseDate: {
    type: String,
    required: true,
    unique: false,
  },
  owner: [
    {
      type: SchemaTypes.ObjectId,
      ref: 'Games',
    },
  ],
});

gameSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const GameModel = model('Games', gameSchema, 'games');
