import { BaseRouter } from "./base.router";
import { Request, Response, NextFunction } from "express";
import { UserRegistrationService } from "../services/user-registration.service";
import { AuthLoginService } from "../services/auth-login.service";
import { singleton } from "tsyringe";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { AuthError } from "../errors/auth.error";
import { ValidationError } from "../errors/validation.error";

@singleton()
export class AuthRouter extends BaseRouter {
    constructor(
        private readonly _userRegistrationService: UserRegistrationService,
        private readonly _authLoginService: AuthLoginService
    ) {
        super("/auth");
        this._buildRoutes();
    }

    private async _register(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.body.email && req.body.password) {
                const result =
                    await this._userRegistrationService.RegisterNewUserRequest(
                        req.body.email,
                        req.body.password
                    );
                res.json({
                    message: result,
                });
            } else {
                throw new ValidationError("User Information is required!");
            }
        } catch (error: any) {
            next(error);
        }
    }

    private async _verify(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.query.token) {
                const result =
                    await this._userRegistrationService.UserVerification(
                        req.query.token.toString()
                    );
                res.json({
                    message: result,
                });
            } else {
                throw new ValidationError("Token is required!");
            }
        } catch (error: any) {
            next(error);
        }
    }

    private async _login(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.header("Authorization");
            if (!authHeader || authHeader.indexOf("Basic") < 0) {
                throw new AuthError("Login was unsuccessful!");
            }
            const accessToken =
                await this._authLoginService.LoginBasic(authHeader);
            res.json({
                accessToken,
            });
        } catch (error: any) {
            next(error);
        }
    }

    private async _token(req: Request, res: Response, next: NextFunction) {
        try {
            // @ts-ignore
            res.json(req.user);
        } catch (error: any) {
            next(error);
        }
    }

    private _buildRoutes() {
        this.Router.post("/register", this._register.bind(this));
        this.Router.post("/login", this._login.bind(this));
        this.Router.get("/verify", this._verify.bind(this));
        this.Router.get(
            "/token",
            AuthMiddleware.Authorize,
            this._token.bind(this)
        );
    }
}
