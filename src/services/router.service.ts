import { singleton } from "tsyringe";
import { HealthRouter } from "../routers/health.router";
import { Router } from "express";
import { AuthRouter } from "../routers/auth.router";
import { BaseRouter } from "../routers/base.router";
import { EnvService } from "./env.service";
import { NodeEnv } from "../models/enums/node-env.enum";
import { LoggingService } from "./logging.service";
import { AppSettingsMiddleware } from "../middleware/app-settings.middleware";

@singleton()
export class RouterService {
    private readonly _allRouters: Array<BaseRouter>;

    constructor(
        private readonly _envService: EnvService,
        private readonly _log: LoggingService,
        _healthRouter: HealthRouter,
        _authRouter: AuthRouter
    ) {
        this._allRouters = [_healthRouter, _authRouter];
    }

    public InitializeRouters() {
        const router = Router();

        // App Settings
        router.use(AppSettingsMiddleware.ValidateAppSettings);

        for (let route of this._allRouters) {
            router.use(route.BasePath, route.Router);
            if (this._envService.NodeEnv !== NodeEnv.PRODUCTION)
                this._log.Logger.debug(
                    `Registered Router: [${route.BasePath}]`
                );
        }

        this._log.Logger.info(
            `Successfully Registered [${this._allRouters.length}] Routers...`
        );

        return router;
    }
}
