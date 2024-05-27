import { container } from "tsyringe";
import { DataSource } from "typeorm";
import { EnvService } from "../core-services/env.service";

if (process.env.NODE_ENV === "migrations") {
    eval('require("dotenv").config()');
}

const envService = container.resolve(EnvService);

export const AppDataSource = new DataSource({
    url: envService.DBConnectionString,
    type: "postgres",
    connectTimeoutMS: 10000,
    schema: "public",
    applicationName: "ozs-api",
    migrations: [__dirname + "/../database/migrations/*.{ts,js}"],
    entities: [__dirname + "/../database/entities/*.{ts,js}"],
});
