import * as fastify from "fastify";
import { singleton } from "tsyringe";
import { BaseRouter } from "../../core-routes/base.router";
import { OrganizationService } from "./organization.service";

@singleton()
export class OrganizationRouter extends BaseRouter {
    constructor(private readonly _orgService: OrganizationService) {
        super("/organizations");
        this._buildRoutes();
    }

    private async _createNewOrg(request: fastify.FastifyRequest, reply: any) {
        const userId = (request as any)["user_id"];
        const name = (request as any).body?.name;

        if (!name) {
            reply.status(400).send({
                status: 400,
                message: "Name is required when creating an organization",
            });
        }

        const org = await this._orgService.CreateNewOrg(userId, name);

        reply.status(201).send(org);
    }

    private _buildRoutes() {
        // V1
        const V1_PREFIX = "/v1";
        this.ROUTE_OPTIONS.push({
            method: "POST",
            url: V1_PREFIX + this.BASE_PATH + "/",
            handler: this._createNewOrg.bind(this),
        });
    }
}
