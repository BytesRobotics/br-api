import { BaseRepository} from '../../../db/baseRepository';

export class SettingsRepository extends BaseRepository {
  constructor() {
    super('settings');
  }
}
