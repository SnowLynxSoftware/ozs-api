import { singleton } from "tsyringe";
import { UserRepository } from "../users/user.repository";
import { EnvService } from "../../core-services/env.service";
import { UserAuthHistoryRepository } from "./user-auth-history.repository";
import { TokenService } from "./token.service";
import { CryptoService } from "./crypto.service";
import { StringUtil } from "../../util/string.util";

@singleton()
export class AuthLoginService {
    constructor(
        private readonly _envService: EnvService,
        private readonly _userRepo: UserRepository,
        private readonly _userAuthHistoryRepo: UserAuthHistoryRepository,
        private readonly _tokenService: TokenService,
        private readonly _cryptoService: CryptoService
    ) {}

    // TODO: DTO
    public async LoginBasic(authHeader: string): Promise<any> {
        const credentials =
            StringUtil.ParseCredentialsFromBasicAuthHeader(authHeader);
        const existingUser = await this._userRepo.GetUserByEmail(
            credentials.email.toLowerCase()
        );

        if (
            !existingUser ||
            !existingUser.verified ||
            existingUser.deleted ||
            (existingUser.auth_lockout_until &&
                Date.now() < existingUser.auth_lockout_until.valueOf())
        ) {
            throw new Error(
                "An error occurred when attempting to log you in. Please try again or request a password reset."
            );
        }

        const isValidPassword = await this._cryptoService.VerifyPassword(
            credentials.password,
            existingUser.password_hash
        );

        if (!isValidPassword) {
            existingUser.fail_attempts++;
            if (
                existingUser.fail_attempts >=
                this._envService.AuthLoginMaxAttempts
            ) {
                existingUser.auth_lockout_until = new Date(
                    Date.now() +
                        this._envService.AuthLoginLockoutInSeconds * 1000
                );
            }
            await this._userRepo.UpdateUser(existingUser);
            throw new Error(
                "An error occurred when attempting to log you in. Please try again or request a password reset."
            );
        }
        const access_token = await this._tokenService.CreateJWTAccessToken(
            existingUser.id
        );

        const refresh_token = await this._tokenService.CreateJWTRefreshToken(
            existingUser.id
        );

        existingUser.last_login = new Date(Date.now());
        // @ts-ignore
        existingUser.auth_lockout_until = null;
        existingUser.fail_attempts = 0;
        await this._userRepo.UpdateUser(existingUser);
        await this._userAuthHistoryRepo.CreateAuthHistoryEntryForUser(
            existingUser
        );

        return {
            access_token,
            id_token: this._tokenService.CreateUserIDToken(existingUser),
            refresh_token,
            access_token_expires_at: new Date(
                Date.now() +
                    parseInt(
                        this._envService.JWTAccessTokenExpiry.substring(
                            0,
                            this._envService.JWTAccessTokenExpiry.indexOf("h")
                        )
                    ) *
                        3600 *
                        1000
            ),
            refresh_token_expires_at: new Date(
                Date.now() +
                    parseInt(
                        this._envService.JWTRefreshTokenExpiry.substring(
                            0,
                            this._envService.JWTRefreshTokenExpiry.indexOf("h")
                        )
                    ) *
                        3600 *
                        1000
            ),
        };
    }

    public async RefreshToken(refreshToken: string): Promise<string> {
        const userId = await this._tokenService.ValidateJWTToken(refreshToken);

        if (!userId) {
            throw new Error(
                "An error occurred when attempting to refresh your token. Please log in again!"
            );
        }

        return this._tokenService.CreateJWTAccessToken(userId);
    }
}
