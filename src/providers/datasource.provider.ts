import { container } from "tsyringe";
import { DataSource } from "typeorm";
import { EnvService } from "../services/env.service";

// TODO: Probably need a cleaner way to handle this--but will work for now.
if (process.env.NODE_ENV === "migrations") {
    eval('require("dotenv").config()');
}

const envService = container.resolve(EnvService);

export const AppDataSource = new DataSource({
    url: envService.DBConnectionString,
    // ...(envService.DBCert && {
    //     ssl: {
    //         ca: envService.DBCert,
    //     },
    // }),
    type: "postgres",
    connectTimeoutMS: 10000,
    schema: "public",
    applicationName: "ozs-api",
    migrations: [__dirname + "/../database/migrations/*.{ts,js}"],
    entities: [__dirname + "/../database/entities/*.{ts,js}"],
});
