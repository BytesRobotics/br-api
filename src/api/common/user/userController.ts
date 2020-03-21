import express from 'express';
const router = express.Router();

import { adminGuard } from '../auth/aclService';
import {UserService} from './userService';
import {CustomErrorService} from '../../../utils/customErrorService';

const userService = new UserService();

router.get('/', adminGuard, (req: any, res: any) => {
  userService
    .list(req.query)
    .then((users: any) => res.send(users));
});

router.post('/', adminGuard, (req: any, res: any) => {
  userService
    .addUser(req.body)
    .then((user: any) => res.send(user))
    .catch((err: any) => res.status(400).send({ error: err.message }));
});

router.get('/current', (req: any, res: any) => {
  userService
    .findById(req.user.id)
    .then((user: any) => res.send(user));
});

router.put('/current', (req: any, res: any) => {
  userService
    .editCurrentUser(req.body, req.user.id)
    .then((user: any) => res.send(user))
    .catch((error: any) => {
      if (error instanceof CustomErrorService) {
        res.status(error.metadata && error.metadata.error.code)
          .send(error);
      }
    });
});

router.get('/:id', adminGuard, (req: any, res: any) => {
  userService
    .findById(req.params.id)
    .then((user: any) => res.send(user));
});

router.put('/:id', adminGuard, (req: any, res: any) => {
  userService
    .editUser(req.body, req.params.id)
    .then((user: any) => res.send(user))
    .catch((error: any) => {
      if (error instanceof CustomErrorService) {
        res.status(error.metadata && error.metadata.error.code)
          .send(error);
      }
    });
});

router.delete('/:id', adminGuard, (req: any, res: any) => {
  userService
    .deleteUser(req.params.id)
    .then(() => res.send({ id: req.params.id }));
});

module.exports = router;
