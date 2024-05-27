import * as fastify from "fastify";
import { singleton } from "tsyringe";
import { BaseRouter } from "../../core-routes/base.router";
import { UserRegistrationService } from "./user-registration.service";
import { EnvService } from "../../core-services/env.service";
import { AuthLoginService } from "./auth-login.service";
import { UserPasswordResetService } from "./user-password-reset.service";
import { NodeEnv } from "../../models/enums/node-env.enum";

@singleton()
export class AuthRouter extends BaseRouter {
    constructor(
        private readonly _userRegistrationService: UserRegistrationService,
        private readonly _userPasswordResetService: UserPasswordResetService,
        private readonly _authLoginService: AuthLoginService,
        private readonly _envService: EnvService
    ) {
        super("/auth");
        this._buildRoutes();
    }

    private async _login(request: fastify.FastifyRequest, reply: any) {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            reply.send({
                status: 400,
                message: "Invalid Login Request!",
            });
        }

        const result = await this._authLoginService.LoginBasic(
            (authHeader as string).toString()
        );

        reply
            .setCookie("x-access-token", result.access_token, {
                path: "/",
                httpOnly: true,
                domain:
                    this._envService.NodeEnv === NodeEnv.PRODUCTION
                        ? "*.vistatable.com"
                        : "localhost",
                secure: this._envService.NodeEnv === NodeEnv.PRODUCTION,
            })
            .setCookie("x-refresh-token", result.access_token, {
                path: "/v1/auth/refresh-token",
                httpOnly: true,
                domain:
                    this._envService.NodeEnv === NodeEnv.PRODUCTION
                        ? "*.vistatable.com"
                        : "localhost",
                secure: this._envService.NodeEnv === NodeEnv.PRODUCTION,
            })
            .send(result);
    }

    private async _refreshToken(request: any, reply: any) {
        let refreshToken = request.headers["x-refresh-token"];

        if (!refreshToken) {
            refreshToken = request.cookies["x-refresh-token"];
        }

        if (!refreshToken) {
            reply.send({
                status: 400,
                message: "Invalid Refresh Request! Token Required!",
            });
        }

        const access_token = await this._authLoginService.RefreshToken(
            (refreshToken as string).toString()
        );
        reply.send({
            access_token,
        });
    }

    private async _registerNewUser(
        request: fastify.FastifyRequest,
        reply: fastify.FastifyReply
    ) {
        // TODO: DTO
        const userRequest: any = request.body as any;

        if (!userRequest.email || !userRequest.password || !userRequest.name) {
            reply.send({
                email: userRequest.email,
                status: 400,
                message: "Invalid Registration Request!",
            });
        }

        const result =
            await this._userRegistrationService.RegisterNewUserRequest(
                userRequest
            );
        reply.status(result.status).send(result);
    }

    private async _verifyNewUser(
        request: fastify.FastifyRequest,
        reply: fastify.FastifyReply
    ) {
        const token = (request.query as any).token;
        if (!token) {
            reply.status(500).send("Token is required!");
        }
        const result = await this._userRegistrationService.UserVerification(
            token.toString()
        );
        reply.type("text/html").send(`<html>
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
                            <h1>VistaTable Account Verification</h1>
                            <p><span>${result}</span></p>
                            <br /><br />
                            <p><a href="${this._envService.AppBaseFrontendURL}/login">Log in!</a></p>
                        </div>
                    </body>
                </html>`);
    }

    private async _passwordResetRequest(
        request: fastify.FastifyRequest,
        reply: fastify.FastifyReply
    ) {
        const email = (request.query as any).email;

        if (!email) {
            reply.send({
                email: "NULL",
                status: 400,
                message: "Invalid Password Reset Request!",
            });
        }

        const result =
            await this._userPasswordResetService.UserPasswordResetRequest(
                email
            );
        reply.status(result.status).send(result);
    }

    private async _passwordResetVerification(
        request: fastify.FastifyRequest,
        reply: fastify.FastifyReply
    ) {
        const token = (request.query as any).token;
        if (!token) {
            reply.status(500).send("Token is required!");
        }
        const result =
            await this._userPasswordResetService.PasswordResetUserVerification(
                token
            );
        reply.type("text/html").send(`<html>
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
                            <h1>VistaTable Password Reset Verification</h1>
                            <p><span>${result}</span></p>
                            <br /><br />
                            <p><a href="${this._envService.AppBaseFrontendURL}/login">Log in!</a></p>
                        </div>
                    </body>
                </html>`);
    }

    private _buildRoutes() {
        // V1
        const V1_PREFIX = "/v1";
        this.ROUTE_OPTIONS.push({
            method: "POST",
            url: V1_PREFIX + this.BASE_PATH + "/login",
            handler: this._login.bind(this),
        });
        this.ROUTE_OPTIONS.push({
            method: "POST",
            url: V1_PREFIX + this.BASE_PATH + "/register",
            handler: this._registerNewUser.bind(this),
        });
        this.ROUTE_OPTIONS.push({
            method: "POST",
            url: V1_PREFIX + this.BASE_PATH + "/refresh-token",
            handler: this._refreshToken.bind(this),
        });
        this.ROUTE_OPTIONS.push({
            method: "GET",
            url: V1_PREFIX + this.BASE_PATH + "/verify",
            handler: this._verifyNewUser.bind(this),
        });
        this.ROUTE_OPTIONS.push({
            method: "POST",
            url: V1_PREFIX + this.BASE_PATH + "/password-reset-request",
            handler: this._passwordResetRequest.bind(this),
        });
        this.ROUTE_OPTIONS.push({
            method: "GET",
            url: V1_PREFIX + this.BASE_PATH + "/password-reset-verification",
            handler: this._passwordResetVerification.bind(this),
        });
    }
}
