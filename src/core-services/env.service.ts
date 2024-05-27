import { singleton } from "tsyringe";
import { EnvProvider, IRawEnv } from "../providers/env.provider";
import { LogLevel } from "../models/enums/log-level.enum";
import { NodeEnv } from "../models/enums/node-env.enum";

@singleton()
export class EnvService {
    private readonly _rawEnv: IRawEnv;
    constructor() {
        this._rawEnv = EnvProvider.LoadRawEnv();
        console.debug("Env Service Loaded Successfully!");
    }

    public get AppKey(): string {
        return this._rawEnv.APP_KEY;
    }

    public get AppBaseAPIURL(): string {
        return this._rawEnv.APP_BASE_API_URL;
    }

    public get AppBaseFrontendURL(): string {
        return this._rawEnv.APP_BASE_FRONTEND_URL;
    }

    public get NodeEnv(): NodeEnv {
        return this._rawEnv.NODE_ENV as NodeEnv;
    }

    public get LogLevel(): LogLevel {
        return this._rawEnv.LOG_LEVEL as LogLevel;
    }

    public get DBConnectionString(): string {
        return this._rawEnv.DB_CONNECTION_STRING;
    }

    public get JWTSecret(): string {
        return this._rawEnv.JWT_SECRET;
    }

    public get JWTAccessTokenExpiry(): string {
        return this._rawEnv.JWT_ACCESS_TOKEN_EXPIRY;
    }

    public get JWTVerificationTokenExpiry(): string {
        return this._rawEnv.JWT_VERIFICATION_TOKEN_EXPIRY;
    }

    public get JWTRefreshTokenExpiry(): string {
        return this._rawEnv.JWT_REFRESH_TOKEN_EXPIRY;
    }

    public get AuthLoginMaxAttempts(): number {
        return parseInt(this._rawEnv.AUTH_LOGIN_MAX_ATTEMPTS);
    }

    public get AuthLoginLockoutInSeconds(): number {
        return parseInt(this._rawEnv.AUTH_LOGIN_LOCKOUT_IN_SECONDS);
    }

    public get CryptoKeyLength(): number {
        return parseInt(this._rawEnv.CRYPTO_KEY_LENGTH);
    }

    public get CryptoSaltSize(): number {
        return parseInt(this._rawEnv.CRYPTO_SALT_SIZE);
    }

    public get EmailProviderAPIKey(): string {
        return this._rawEnv.EMAIL_PROVIDER_API_KEY;
    }
}
