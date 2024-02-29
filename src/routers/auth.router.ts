import { BaseRouter } from "./base.router";
import { Request, Response, NextFunction } from "express";
import { UserRegistrationService } from "../services/auth/user-registration.service";
import { AuthLoginService } from "../services/auth/auth-login.service";
import { singleton } from "tsyringe";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { AuthError } from "../errors/auth.error";
import { ValidationError } from "../errors/validation.error";
import { EnvService } from "../services/env.service";

@singleton()
export class AuthRouter extends BaseRouter {
    constructor(
        private readonly _envService: EnvService,
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
                res.send(`<html>
                <head>
                    <style>
                        @import url(https://fonts.bunny.net/css?family=abel:400|adamina:400|prompt:100i,200i,300,300i,400,400i,500,500i,600,600i,700,800);
                        html, body {
                            font-family: 'Abel', sans-serif;
                            font-family: 'Adamina', serif;
                            font-family: 'Prompt', sans-serif;
                        }
                        .container {
                            width: 50%;
                            margin: 100px auto;
                            border: 1px solid black;
                            box-shadow: 1px 2px 3px gray;
                            padding: 15px;                            
                        }
                        .container h1 {
                            text-align: center;
                        }
                        .container p {
                            text-align: center;
                            font-size: 1.2rem;
                        }
                        .container span {
                            font-style: italic;
                        }                        
                    </style>
                </head>
                    <body>
                        <div class="container">
                            <h1>OpenZooSim Account Verification</h1>
                            <p><span>${result}</span></p>
                            <br /><br />
                            <p><a href="${this._envService.AppBaseFrontendURL}/login">Log in!</a></p>
                        </div>
                    </body>
                </html>`);
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
