import * as fastify from "fastify";
import { container } from "tsyringe";
import { AuthorizationService } from "../modules/auth/authorization.service";

export class AuthMiddleware {
    // Basic Authorize Handler
    public static async Authorize(
        request: fastify.FastifyRequest,
        reply: fastify.FastifyReply
    ) {
        const accessToken = (request as any).cookies["x-access-token"];
        if (!accessToken) {
            reply.status(401).send({
                message: "UNAUTHORIZED. User is not logged in!",
            });
        }

        const _authorizationService = container.resolve(AuthorizationService);
        const userID =
            await _authorizationService.VerifyAccessTokenAndReturnUserID(
                accessToken
            );
        if (userID === null) {
            reply.status(401).send({
                message: "UNAUTHORIZED. Token is not valid!",
            });
        }

        (request as any)["user_id"] = userID;
    }
}
