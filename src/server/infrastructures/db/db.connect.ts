import mongoose from 'mongoose';
import { config } from '../../../config.js';
import createDebug from 'debug';
const debug = createDebug('dbConnect');

const { pass, cluster, dbname } = config;

export const dbConnect = (env?: string) => {
  const finalEnv = env || process.env.NODE_ENV;
  const finalDBname = finalEnv === 'test' ? dbname + '_Testing' : dbname;

  const uri = `mongodb+srv://fabiodn798:${pass}@${cluster}/${finalDBname}?retryWrites=true&w=majority`;
  debug(uri);
  return mongoose.connect(uri);
};
