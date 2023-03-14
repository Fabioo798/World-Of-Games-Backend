import { NextFunction, Response } from 'express';
import createDebug from 'debug';
import { HTTPError } from '../../../commons/error';
import { RequestPlus, TokenPayload } from '../../../commons/interfaces';
import { Auth } from '../auth/auth';

const debug = createDebug('W7CH5: interceptors');

export class Interceptors {
  logged(req: RequestPlus, _resp: Response, next: NextFunction) {
    try {
      const authHeader = req.get('Authorization');
      if (!authHeader)
        throw new HTTPError(
          498,
          'Invalid header',
          'Incorrect value in Auth Header'
        );
      if (!authHeader.startsWith('Bearer'))
        throw new HTTPError(498, 'Invalid header', 'Not bearer in auth header');
      const token = authHeader.slice(7);
      const payload = Auth.verifyJWTgettingPayload(token);
      req.info = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };
      debug('Logged!');
      next();
    } catch (error) {
      next(error);
    }
  }

  authorized(req: RequestPlus, _res: Response, next: NextFunction) {
    try {
      debug('Authorized Interceptor');

      if (!req.info)
        throw new HTTPError(
          498,
          'Token not found',
          'Token not found in authorized interceptor'
        );

      if (!req.params.id)
        throw new HTTPError(404, 'Not found', 'Not found user ID in params');

      if ((req.info as TokenPayload).id !== req.params.id)
        throw new HTTPError(
          401,
          'Unauthorized',
          'The ID from params is not equal to ID from Token'
        );

      req.body.id = (req.info as TokenPayload).id;

      next();
    } catch (error) {
      next(error);
    }
  }
}
