import { Repository } from "typeorm";
import { Database } from "../database.context";

export class BaseRepository {
    protected _repo: Repository<any>;

    constructor(database: Database, entity: any) {
        this._repo = database.GetRepository(entity);
    }

    public async Delete(id: number): Promise<void> {
        await this._repo.softDelete({
            id,
        });
    }
}
