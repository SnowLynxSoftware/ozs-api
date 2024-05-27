import { singleton } from "tsyringe";
import { BaseRepository } from "../../database/repositories/base-repository";
import { Database } from "../../database/database.context";
import { SettingsEntity } from "../../database/entities/settings.entity";

@singleton()
export class SettingsRepository extends BaseRepository {
    constructor(database: Database) {
        super(database, SettingsEntity);
    }

    public async GetAppSettings(): Promise<SettingsEntity> {
        return this._repo.findOneBy({ id: 1 }) as unknown as SettingsEntity;
    }
}
