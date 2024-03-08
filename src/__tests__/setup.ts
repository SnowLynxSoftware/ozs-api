import "reflect-metadata";
require("dotenv").config();
import { TestDBManager } from "./test-db.manager";
import { container } from "tsyringe";
import { startup } from "../startup";
import { Database } from "../database/database.context";

/**
 * Before each test suite--we will rebuild the database instance for that suite.
 * Then afterward, we will delete it.
 */
export const setup = async () => {

    const testDBManager = container.resolve(TestDBManager);
    const testDBName = await testDBManager.InitializeTestingDatabase();

    const httpServer = await startup(testDBName);

    return {
        httpServer,
        testDBName
    }

};

export const tearDown = async (testDBName: string) => {
    const testDBManager = container.resolve(TestDBManager);
    await container.resolve(Database).CloseConnection();
    await testDBManager.RemoveTestDBInstance(testDBName);
}