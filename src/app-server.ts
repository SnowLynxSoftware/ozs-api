import { singleton } from "tsyringe";
import { InitService } from "./core-services/init.service";
import * as fastify from "fastify";

@singleton()
export class AppServer {
    private readonly _app: fastify.FastifyInstance;

    constructor(private readonly _initService: InitService) {
        this._app = fastify.default({
            logger: false,
            ignoreTrailingSlash: true,
        });
        this._initService.PreInit(this._app);
    }

    public async Start() {
        await this._initService.Init(this._app);
        return this._app.listen({
            // @ts-ignore
            port: parseInt(process.env.PORT?.toString() || 3000),
            host: "0.0.0.0",
        });
    }
}
