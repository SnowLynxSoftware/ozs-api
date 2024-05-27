import { singleton } from "tsyringe";
import { EnvService } from "./env.service";
import winston from "winston";
import { LoggerProvider } from "../providers/logger.provider";

@singleton()
export class LoggingService {
    public readonly Logger: winston.Logger;

    constructor(_envService: EnvService) {
        this.Logger = LoggerProvider.CreateMainLogger(
            _envService.LogLevel,
            _envService.NodeEnv
        );
        this.Logger.debug("Logging Service Is Live!");
    }
}
