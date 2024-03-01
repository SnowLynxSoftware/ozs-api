import { singleton } from "tsyringe";
import { UserRepository } from "../../database/repositories/user.repository";
import { TokenService } from "../token.service";
import { StringUtil } from "../../utils/string.util";
import { CryptoService } from "../crypto.service";
import { UserAuthHistoryRepository } from "../../database/repositories/user-auth-history.repository";
import { EnvService } from "../env.service";
import { AuthError } from "../../errors/auth.error";

@singleton()
export class AuthLoginService {
    constructor(
        private readonly _envService: EnvService,
        private readonly _userRepo: UserRepository,
        private readonly _userAuthHistoryRepo: UserAuthHistoryRepository,
        private readonly _tokenService: TokenService,
        private readonly _cryptoService: CryptoService
    ) {}

    public async LoginBasic(authHeader: string): Promise<string> {
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
            throw new AuthError(
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
            throw new AuthError(
                "An error occurred when attempting to log you in. Please try again or request a password reset."
            );
        }
        const accessToken = await this._tokenService.CreateJWTAccessToken(
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

        return accessToken;
    }
}
