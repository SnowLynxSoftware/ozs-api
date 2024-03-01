import { singleton } from "tsyringe";
import { BaseRepository } from "./base-repository";
import { Database } from "../database.context";
import { AppSettingsEntity } from "../entities/app-settings.entity";

@singleton()
export class AppSettingsRepository extends BaseRepository {
    constructor(database: Database) {
        super(database, AppSettingsEntity);
    }

    public async GetAppSettings(): Promise<AppSettingsEntity | null> {
        return this._repo.findOneBy({
            deleted: null,
        }) as unknown as AppSettingsEntity;
    }
}
