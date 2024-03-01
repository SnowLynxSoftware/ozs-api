import { singleton } from "tsyringe";
import { BaseRepository } from "./base-repository";
import { Database } from "../database.context";
import { UserAuthHistoryEntity } from "../entities/user-auth-history.entity";
import { UserEntity } from "../entities/user.entity";

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
