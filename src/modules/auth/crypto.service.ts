import { singleton } from "tsyringe";
import { EnvService } from "../../core-services/env.service";
import { scrypt, randomBytes } from "node:crypto";

@singleton()
export class CryptoService {
    constructor(private readonly _envService: EnvService) {}

    private async _hash(password: string, randomSalt: string): Promise<string> {
        return new Promise((resolve, reject) => {
            scrypt(
                password,
                randomSalt,
                this._envService.CryptoKeyLength,
                (err, derivedKey) => {
                    if (err) reject(err);
                    resolve(derivedKey.toString("hex"));
                }
            );
        });
    }

    public async VerifyPassword(
        password: string,
        hash: string
    ): Promise<boolean> {
        try {
            const [salt, key] = hash.split(":");
            const newHash = await this._hash(password, salt);
            return key === newHash;
        } catch (error: any) {
            return false;
        }
    }

    public async HashPassword(password: string) {
        const randomSalt =
            randomBytes(this._envService.CryptoSaltSize).toString("hex") +
            this._envService.AppKey;

        const hash = await this._hash(password, randomSalt);
        return randomSalt + ":" + hash;
    }

    public GenerateRandomString(size: number): string {
        return randomBytes(size).toString("hex");
    }
}
