import { DataSource } from "typeorm";
import { singleton } from "tsyringe";
import { AppDataSource } from "../providers/datasource.provider";
import { LoggingService } from "../core-services/logging.service";

@singleton()
export class Database {
    private _db: DataSource;

    public GetRepository(entity: any) {
        return this._db.getRepository(entity);
    }

    constructor(private readonly _log: LoggingService) {
        this._db = AppDataSource;
    }

    /**
     * If the dbNameOverride is supplied, it means we are running the integrations tests.
     */
    public async Initialize() {
        try {
            await this._db.initialize();
            if (this._db.isInitialized) {
                this._log.Logger.info("Database is connected!");
            } else {
                throw new Error("Database could not connect!");
            }
        } catch (error: any) {
            this._log.Logger.error(error.message);
            process.exit(1);
        }
    }

    public async CloseConnection() {
        await this._db.destroy();
    }
}
