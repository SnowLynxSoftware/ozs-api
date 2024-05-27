import { container } from "tsyringe";
import { EnvService } from "./core-services/env.service";
import { Database } from "./database/database.context";
import { AppServer } from "./app-server";
import { LoggingService } from "./core-services/logging.service";

/**
 * In startup, we will register a few providers and services that we need to load.
 * These things will help up in the init phase when we start the server.
 *
 * Finally, we will actually start an instance of the application server here.
 */

export const startup = async () => {
    // Load Env Service first--if this fails, we should quit the app early.
    container.resolve(EnvService);

    // Init Logging Service
    container.resolve(LoggingService);

    // Init DB Provider
    await container.resolve(Database).Initialize();

    // At this point--we are ready to start spinning up the HTTP Server to bind everything together
    const appServer = container.resolve(AppServer);
    return appServer.Start();
};
