import winston from "winston";
import { LogLevel } from "../models/enums/log-level.enum";
import { NodeEnv } from "../models/enums/node-env.enum";

export class LoggerProvider {
    public static CreateMainLogger(
        logLevel: LogLevel,
        nodeEnv: NodeEnv
    ): winston.Logger {
        return winston.createLogger({
            level: logLevel,
            ...(nodeEnv !== NodeEnv.PRODUCTION && {
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.simple()
                ),
                transports: [new winston.transports.Console()],
            }),
            ...(nodeEnv === NodeEnv.PRODUCTION && {
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                ),
                transports: [
                    new winston.transports.File({
                        filename: "error.log",
                        level: "error",
                    }),
                    new winston.transports.File({ filename: "combined.log" }),
                ],
            }),
        } as any);
    }
}
