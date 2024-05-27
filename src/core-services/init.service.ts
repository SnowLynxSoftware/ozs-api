import { singleton } from "tsyringe";
import { RouterService } from "./router.service";
import * as fastify from "fastify";
import { EnvService } from "./env.service";

@singleton()
export class InitService {
    constructor(
        private readonly _routerService: RouterService,
        private readonly _envService: EnvService
    ) {}

    /**
     * PreInit is called before the server starts.
     */
    public PreInit(app: fastify.FastifyInstance): void {
        app.register(require("@fastify/helmet"), {});
        app.register(require("@fastify/cookie"), {});
        app.register(require("@fastify/cors"), {
            origin: this._envService.AppBaseFrontendURL,
            methods: ["GET", "POST", "PUT"],
            credentials: true,
        });
    }

    /**
     * Init is called while the server is starting.
     */
    public async Init(app: fastify.FastifyInstance) {
        this._routerService.InitializeRouters(app);
    }
}
