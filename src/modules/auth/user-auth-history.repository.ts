import { singleton } from "tsyringe";
import { BaseRepository } from "../../database/repositories/base-repository";
import { Database } from "../../database/database.context";
import { UserAuthHistoryEntity } from "../../database/entities/user-auth-history.entity";
import { UserEntity } from "../../database/entities/user.entity";

@singleton()
export class UserAuthHistoryRepository extends BaseRepository {
    constructor(database: Database) {
        super(database, UserAuthHistoryEntity);
    }

    public async CreateAuthHistoryEntryForUser(
        user: UserEntity
    ): Promise<void> {
        const historyEntry = new UserAuthHistoryEntity();
        historyEntry.user = user;
        await this._repo.insert(historyEntry);
    }
}
