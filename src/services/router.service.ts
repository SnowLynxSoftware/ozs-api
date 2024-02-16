import { singleton } from "tsyringe";
import { HealthRouter } from "../routers/health.router";
import { Router } from "express";
import { AuthRouter } from "../routers/auth.router";
import { BaseRouter } from "../routers/base.router";

@singleton()
export class RouterService {
    private readonly _allRouters: Array<BaseRouter>;

    constructor(_healthRouter: HealthRouter, _authRouter: AuthRouter) {
        this._allRouters = [_healthRouter, _authRouter];
    }

    public InitializeRouters() {
        const router = Router();

        for (let route of this._allRouters) {
            router.use(route.BasePath, route.Router);
            console.log(`Registered Router: [${route.BasePath}]`);
        }

        console.log(
            `Successfully Registered [${this._allRouters.length}] Routers...`
        );

        return router;
    }
}
