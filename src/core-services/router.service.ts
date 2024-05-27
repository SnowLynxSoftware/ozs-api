import { singleton } from "tsyringe";
import { EnvService } from "./env.service";
import { LoggingService } from "./logging.service";
import { HealthRouter } from "../core-routes/health.router";
import { BaseRouter } from "../core-routes/base.router";
import * as fastify from "fastify";
import { AuthRouter } from "../modules/auth/auth.router";
import { OrganizationRouter } from "../modules/organizations/organization.router";
import { NodeEnv } from "../models/enums/node-env.enum";

@singleton()
export class RouterService {
    private readonly _allRouters: Array<BaseRouter>;

    constructor(
        private readonly _envService: EnvService,
        private readonly _log: LoggingService,
        _healthRouter: HealthRouter,
        _authRouter: AuthRouter,
        _orgRouter: OrganizationRouter
    ) {
        this._allRouters = [_healthRouter, _authRouter, _orgRouter];
    }

    public InitializeRouters(app: fastify.FastifyInstance): void {
        for (let route of this._allRouters) {
            for (let opt of route.ROUTE_OPTIONS) {
                app.route(opt);
                if (this._envService.NodeEnv !== NodeEnv.PRODUCTION)
                    this._log.Logger.debug(`Registered Route: [${opt.url}]`);
            }
        }

        this._log.Logger.info(
            `Successfully Registered [${this._allRouters.length}] Routers...`
        );
    }
}
