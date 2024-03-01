import { singleton } from "tsyringe";
import { AppSettingsRepository } from "../database/repositories/app-settings.repository";
import { RedisService } from "./redis.service";
import { AppSettingsEntity } from "../database/entities/app-settings.entity";

@singleton()
export class AppSettingsService {
    private readonly _appSettingsCacheKey: string = "app_settings";

    constructor(
        private readonly _appSettingsRepo: AppSettingsRepository,
        private readonly _redisService: RedisService
    ) {}

    public async GetAppSettings(): Promise<AppSettingsEntity> {
        const cachedSettings = await this._redisService.Get(
            this._appSettingsCacheKey
        );
        if (cachedSettings) {
            return JSON.parse(cachedSettings) as AppSettingsEntity;
        }
        const dbAppSettings = await this._appSettingsRepo.GetAppSettings();
        if (!dbAppSettings) {
            throw new Error("NO APP SETTINGS FOUND!");
        } else {
            await this._redisService.Set(
                this._appSettingsCacheKey,
                JSON.stringify(dbAppSettings),
                3600
            );
            return dbAppSettings;
        }
    }
}
