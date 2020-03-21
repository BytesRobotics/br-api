import { SettingsRepository } from "./settingsRepository";

export class SettingsService {
  repository: any;

  constructor() {
    this.repository = new SettingsRepository();
  }

  findById(id: string) {
    return this.repository.findById(id)
      .then((user: any) => this.mapSettingsToDto(user));
  }

  edit(id: string, dto: any) {
    const settings = this.mapDtoToSettings(dto);
    return this.repository.edit(id, settings);
  }

  mapSettingsToDto(item: any) {
    return item ? {
      themeName: item.themeName,
    } : {};
  }

  mapDtoToSettings(dto: any) {
    return dto ? {
      themeName: dto.themeName,
    } : {};
  }
}
