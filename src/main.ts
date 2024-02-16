import "reflect-metadata";
import { startup } from "./startup";
import * as http from "http";
import { AddressInfo } from "node:net";

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
    .then((srv: http.Server) => {
        console.timeEnd("App Startup Time");
        const addr = srv.address() as AddressInfo;
        console.log(`OpenZooSim is running at: [${addr.address}:${addr.port}]`);
    })
    .catch((error) => {
        console.error(error.message);
    });
