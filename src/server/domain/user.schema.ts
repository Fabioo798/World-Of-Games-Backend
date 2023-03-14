import { model, Schema, SchemaTypes } from 'mongoose';
import User from '../../user/domain/user.model';


const userSchema = new Schema<User>({

  name: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type:String,
    required: true,
  },
  shoplist: [
    {
      type: SchemaTypes.ObjectId,
      ref: 'Games',
    },
  ],
  mygames: [
    {
      type: SchemaTypes.ObjectId,
      ref: 'Games',
    },
  ],
  address: {
    type: String,
    required: false,
    unique: false,
  }
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const UserModel = model('User', userSchema, 'users');
