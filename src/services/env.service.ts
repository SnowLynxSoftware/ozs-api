import { singleton } from "tsyringe";
import { EnvProvider, IRawEnv } from "../providers/env.provider";
import { NodeEnv } from "../models/enums/node-env.enum";
import { LogLevel } from "../models/enums/log-level.enum";

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

    public get RedisURL(): string {
        return this._rawEnv.REDIS_URL;
    }

    public get DBCert(): string {
        return Buffer.from(this._rawEnv.DB_CERT, "base64").toString("utf-8");
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

    public get TestDBConnectionString(): string {
        return this._rawEnv.TEST_DB_CONNECTION_STRING;
    }

    public get TestDBTemplateName(): string {
        return this._rawEnv.TEST_DB_TEMPLATE_NAME;
    }
}
