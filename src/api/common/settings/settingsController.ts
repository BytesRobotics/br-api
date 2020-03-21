import express from 'express';

const router = express.Router();

import { SettingsService } from './settingsService';

const settingService = new SettingsService();

router.get('/current', (req: any, res: any) => {
  settingService
    .findById(req.user.id)
    .then((user: any) => res.send(user));
});

router.put('/current', (req: any, res: any) => {
  settingService
    .edit(req.user.id, req.body)
    .then((user: any) => res.send(user));
});

module.exports = router;
