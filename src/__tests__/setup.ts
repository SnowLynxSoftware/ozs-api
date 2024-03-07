import "reflect-metadata";
// import { TestDBManager } from "./test-db.manager";
// import { container } from "tsyringe";
import { startup } from "../startup";
import { TestRunnerManager } from "./test-runner.manager";

const setup = async () => {
    // const testDBManager = container.resolve(TestDBManager);
    // const testDBName = await testDBManager.InitializeTestingDatabase();

    const httpServer = await startup();

    const runnerManager = new TestRunnerManager(httpServer);
    await runnerManager.RunTests();
};

setup().catch((error) => {
    console.error(error.message);
});