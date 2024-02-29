import { Request, Response, NextFunction } from "express";
import { StringUtil } from "../utils/string.util";
import { container } from "tsyringe";
import { TokenService } from "../services/token.service";
import { UserRepository } from "../database/repositories/user.repository";
import { AuthError } from "../errors/auth.error";
import { ForbiddenError } from "../errors/forbidden.error";

export class AuthMiddleware {
    public static async Authorize(
        req: Request,
        _res: Response,
        next: NextFunction
    ) {
        try {
            const authHeader = req.header("Authorization");
            if (!authHeader) {
                throw new AuthError("You are not logged in!");
            }
            const accessToken =
                StringUtil.GetBearerTokenFromAuthHeader(authHeader);
            const _tokenService = container.resolve(TokenService);
            const userID = await _tokenService.ValidateJWTToken(accessToken);
            const _userRepo = container.resolve(UserRepository);
            const user = await _userRepo.GetUserByID(userID);
            if (!user || !user.verified) {
                throw new ForbiddenError(
                    "You do not have permission to access these resources!"
                );
            } else {
                // @ts-ignore
                delete user.password_hash;
                // @ts-ignore
                req.user = user;
                next();
            }
        } catch (error) {
            next(error);
        }
    }
}
