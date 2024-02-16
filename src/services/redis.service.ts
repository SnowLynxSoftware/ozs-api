import { singleton } from "tsyringe";
import { EnvService } from "./env.service";
import Redis from "ioredis";
import { LoggingService } from "./logging.service";

@singleton()
export class RedisService {
    private _client: Redis | null = null;

    constructor(
        private readonly _env: EnvService,
        private readonly _log: LoggingService
    ) {}

    public async Initialize() {
        this._client = new Redis(this._env.RedisURL);
        const result = await this._client.ping();
        if (result === "PONG") {
            this._log.Logger.info("Redis is connected!");
        } else {
            throw new Error(
                "An issue occurred when attempting to connect to Redis."
            );
        }
    }
}
