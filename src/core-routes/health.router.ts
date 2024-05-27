import { BaseRouter } from "./base.router";
import * as fastify from "fastify";
import { singleton } from "tsyringe";
import { PackageUtil } from "../util/package.util";
import { AuthMiddleware } from "../middlewares/auth.middleware";

@singleton()
export class HealthRouter extends BaseRouter {
    constructor() {
        super("/health");
        this._buildRoutes();
    }

    private _getHealthCheck(
        _request: fastify.FastifyRequest,
        reply: fastify.FastifyReply
    ) {
        const version = PackageUtil.GetVersion();
        reply.send("ok:" + version);
    }

    private _buildRoutes() {
        this.ROUTE_OPTIONS.push({
            method: "GET",
            url: this.BASE_PATH + "/",
            schema: {
                response: {
                    200: {
                        type: "string",
                    },
                },
            },
            preHandler: AuthMiddleware.Authorize,
            handler: this._getHealthCheck.bind(this),
        });
    }
}
