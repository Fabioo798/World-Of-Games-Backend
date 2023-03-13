import { Request } from 'express';
import jwt from 'jsonwebtoken';


export interface TokenPayload extends jwt.JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface RequestPlus extends Request {
  info?: TokenPayload;
}
