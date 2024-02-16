import { singleton } from "tsyringe";
import { EnvProvider, IRawEnv } from "../providers/env.provider";
import { NodeEnv } from "../models/enums/node-env.enum";

@singleton()
export class EnvService {
    private readonly _rawEnv: IRawEnv;
    constructor() {
        this._rawEnv = EnvProvider.LoadRawEnv();
    }

    public get AppKey(): string {
        return this._rawEnv.APP_KEY;
    }

    public get AppBaseAPIURL(): string {
        return this._rawEnv.APP_BASE_API_URL;
    }

    public get NodeEnv(): NodeEnv {
        return this._rawEnv.NODE_ENV as NodeEnv;
    }

    public get DBConnectionString(): string {
        return this._rawEnv.DB_CONNECTION_STRING;
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
