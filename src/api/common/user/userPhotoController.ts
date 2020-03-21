import express from 'express';
import path from 'path';

import { UserService } from "./userService";

const router = express.Router();
const userService = new UserService();

router.get('/', (req: any, res: any) => {
  userService
    .getPhoto(req.query.token)
    .then((photo: any) => {
      const filePath = path.join(__dirname, `../../../../assets/${photo}`);

      res.sendFile(filePath);
    }).catch((error: any) => {
      res.status(400).send({ error: error.message });
    });
});

module.exports = router;
