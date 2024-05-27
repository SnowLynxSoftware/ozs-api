import { singleton } from "tsyringe";
import { SettingsRepository } from "./settings.repository";
import { SettingsEntity } from "../../database/entities/settings.entity";

@singleton()
export class SettingsService {
    constructor(private readonly _settingsRepo: SettingsRepository) {}

    public async GetAllAppSettings(): Promise<SettingsEntity> {
        return this._settingsRepo.GetAppSettings();
    }
}
