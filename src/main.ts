import "reflect-metadata";
import { startup } from "./startup";

/**
 * The Main file will handle bootstrapping the application.
 *
 * We will set up some OH SHIT error handling here for things we miss while in development.
 * Additionally, anything that should be loaded absolutely first at the kernel level,
 * should be loaded here first. Then we will call startup which will actually start
 * the server.
 *
 * This file should mostly never change. Any app level code should go in startup or lower levels.
 */

console.time("App Startup Time");

const bootstrap = async () => {
    process.on("uncaughtException", (error) => {
        console.error(error.message);
        console.error(error.stack);
    });
    process.on("unhandledRejection", () => {
        console.error(
            "An unhandled rejection has occurred! This shouldn't happen!"
        );
    });
    return startup();
};

bootstrap()
    .then((address: string) => {
        console.timeEnd("App Startup Time");
        console.log(`API is running at: [${address}]`);
    })
    .catch((error) => {
        console.error(error.message);
    });
