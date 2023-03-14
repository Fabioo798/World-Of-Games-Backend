// /* eslint-disable new-cap */
// import { Router, Request, Response, NextFunction } from 'express';
// import UserCreator from '../../../user/application/usercreator.js';
// import UserDeleter from '../../../user/application/userdeleter.js';
// import UserFinder from '../../../user/application/userfinder.js';
// import UserUpdater from '../../../user/application/userupdater.js';
// import UserSearcher from '../../../user/application/usersearcher.js';
// import { HTTPError } from '../../../commons/error.js';
// import ServerRouter from '../../Server.router.interface.js';
// import { RequestPlus, TokenPayload } from '../../../commons/interfaces.js';
// import UserRepository from '../../../user/domain/user.model.repo.js';
// import createDebug from 'debug';
// import { Auth } from '../auth/auth.js';

// const debug = createDebug('W7CH5: controller');

// export class UserController {
//   constructor(public repo: UserRepository) {
//     debug('Instantiate CharsController');
//     this.repo = repo;
//   }

//   async register(req: Request, resp: Response, next: NextFunction) {
//     try {
//       debug('register:post method');

//       if (!req.body.email || !req.body.password || !req.body.name)
//         throw new HTTPError(
//           401,
//           'Unauthorized',
//           'Invalid Name, Email or password'
//         );

//       req.body.password = await Auth.hash(req.body.password);

//       req.body.friends = [];
//       req.body.enemies = [];

//       const data = await this.repo.create(req.body);

//       resp.status(201);
//       resp.json({
//         results: [data],
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async logIn(req: Request, resp: Response, next: NextFunction) {
//     try {
//       debug('login:post method');

//       if (!req.body.email || !req.body.password)
//         throw new HTTPError(
//           401,
//           'Unauthorized',
//           'Invalid User Name o password'
//         );

//       const data = await this.repo.search({
//         key: 'email',
//         value: req.body.email,
//       });

//       if (!data.length)
//         throw new HTTPError(401, 'Unauthorized', 'User Name not found');

//       if (!(await Auth.compare(req.body.password, data[0].password)))
//         throw new HTTPError(401, 'Unauthorized', 'Password not match');

//       const payload: TokenPayload = {
//         id: data[0].id,
//         email: data[0].email,
//         role: 'Admin',
//       };

//       const token = Auth.createJWT(payload);

//       resp.status(202);
//       resp.json({
//         results: {
//           token,
//         },
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async editProfile(req: RequestPlus, res: Response, next: NextFunction) {
//     try {
//       debug('Updating profile...');
//       if (!req.info?.id)
//         throw new HTTPError(404, 'User not found', 'User not found');
//       const member = await this.repo.find(req.info.id);
//       req.body.id = member.id;
//       const updatedMember = await this.repo.update(req.body);
//       debug('Profile updated!');
//       res.json({ results: [updatedMember] });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async addEnemyOrFriend(req: RequestPlus, resp: Response, next: NextFunction) {
//     try {
//       debug('addFriends method');

//       // eslint-disable-next-line no-debugger
//       debugger;
//       const userId = req.info?.id;
//       if (!userId) throw new HTTPError(404, 'Not found', 'user id not found');

//       const actualUser = await this.repo.find(userId);

//       const userToAdd = await this.repo.find(req.params.id);

//       if (!userToAdd) throw new HTTPError(405, 'Not found', 'problems');

//       if (req.url.startsWith('/add_friends')) {
//         if (actualUser.friends.find((item) => item.id === userToAdd.id))
//           throw new HTTPError(405, 'Not allowed', 'problem');
//         actualUser.friends.push(userToAdd);
//       }

//       if (req.url.startsWith('/add_enemies')) {
//         if (actualUser.enemies.find((item) => item.id === userToAdd.id))
//           throw new HTTPError(405, 'Not allowed', 'problem');
//         actualUser.enemies.push(userToAdd);
//       }

//       await this.repo.update(actualUser);

//       resp.json({
//         results: [actualUser],
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async removeEnemyOrFriends(
//     req: RequestPlus,
//     resp: Response,
//     next: NextFunction
//   ) {
//     try {
//       debug('removeFriends method');

//       const userId = req.info?.id;

//       if (!userId) throw new Error('Not found');

//       const actualUser = await this.repo.find(userId);

//       const userToAdd = await this.repo.find(req.params.id);

//       if (!userToAdd) throw new Error('Not found');

//       if (req.url.startsWith('/remove_friends')) {
//         if (actualUser.friends.find((item) => item.id !== userToAdd.id))
//           throw new Error('User you try to remove is not in your list');
//         actualUser.friends = actualUser.friends.filter(
//           (item) => item.id !== userToAdd.id
//         );
//       }

//       if (req.url.startsWith('/remove_enemies')) {
//         if (actualUser.enemies.find((item) => item.id !== userToAdd.id))
//           throw new Error('User you try to remove is not in your list');
//         actualUser.enemies = actualUser.enemies.filter(
//           (item) => item.id !== userToAdd.id
//         );
//       }

//       this.repo.update(actualUser);

//       resp.json({
//         results: [actualUser],
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async getAll(_req: Request, resp: Response, next: NextFunction) {
//     debug('controller: getAll');
//     try {
//       const data = await this.repo.query();
//       resp.json({
//         result: data,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// }
