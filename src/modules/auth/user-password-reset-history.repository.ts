import { singleton } from "tsyringe";
import { BaseRepository } from "../../database/repositories/base-repository";
import { Database } from "../../database/database.context";
import { UserEntity } from "../../database/entities/user.entity";
import { UserPasswordResetHistoryEntity } from "../../database/entities/user-password-reset-history.entity";

@singleton()
export class UserPasswordResetHistoryRepository extends BaseRepository {
    constructor(database: Database) {
        super(database, UserPasswordResetHistoryEntity);
    }

    public async CreateUserPasswordResetHistoryEntryForUser(
        user: UserEntity,
        token: string
    ): Promise<void> {
        const historyEntry = new UserPasswordResetHistoryEntity();
        historyEntry.user = user;
        historyEntry.token = token;
        historyEntry.used = false;
        await this._repo.insert(historyEntry);
    }

    public async GetPasswordResetHistoryByToken(
        token: string
    ): Promise<UserPasswordResetHistoryEntity> {
        return this._repo.findOneBy({
            token,
        }) as unknown as UserPasswordResetHistoryEntity;
    }

    public async UpdateHistoryItemAsUsed(token: string): Promise<void> {
        const historyEntry = await this.GetPasswordResetHistoryByToken(token);
        historyEntry.used = true;
        await this._repo.save(historyEntry);
    }
}
