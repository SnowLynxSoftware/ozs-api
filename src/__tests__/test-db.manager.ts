import { injectable } from "tsyringe";
import { Pool } from "pg";
import { EnvService } from "../services/env.service";

@injectable()
export class TestDBManager {

    private _pool: Pool;

    constructor(private _envService: EnvService) {
        this._pool = new Pool({
            connectionString: this._envService.TestDBConnectionString + "postgres"
        });
    }

    public async InitializeTestingDatabase(): Promise<string> {
        const client = await this._pool.connect();
        let testDBName = "";

        try {
            console.log("Creating Test DB Instance...");
            testDBName = this._envService.TestDBTemplateName + "_" + Date.now().toString();
            await client.query(`CREATE DATABASE ${testDBName} WITH TEMPLATE ${this._envService.TestDBTemplateName}`);
            console.log(`Successfully Created [ ${testDBName} ].`);
        } catch (error: any) {
            console.error(error.message);
        } finally {
            client.release();
        }

        return testDBName;
    }

    public async RemoveTestDBInstance(dbName: string): Promise<boolean> {
        const client = await this._pool.connect();

        try {
            console.log("Removing Test DB Instance...");
            await client.query(`DROP DATABASE ${dbName}`);
            console.log(`Successfully Removed [ ${dbName} ].`);
        } catch (error: any) {
            console.error(error.message);
        } finally {
            client.release();
        }

        return true;
    }

}