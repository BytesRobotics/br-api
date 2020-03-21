const BaseRepository = require('../../../db/baseRepository');

export class SettingsRepository extends BaseRepository {
  constructor() {
    super('settings');
  }
}
