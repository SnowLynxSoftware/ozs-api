import { singleton } from "tsyringe";
import { UserRepository } from "../database/repositories/user.repository";
import { TokenService } from "./token.service";
import { StringUtil } from "../utils/string.util";
import { CryptoService } from "./crypto.service";

@singleton()
export class AuthLoginService {
    constructor(
        private readonly _userRepo: UserRepository,
        private readonly _tokenService: TokenService,
        private readonly _cryptoService: CryptoService
    ) {}

    public async LoginBasic(authHeader: string): Promise<string> {
        const credentials =
            StringUtil.ParseCredentialsFromBasicAuthHeader(authHeader);
        const existingUser = await this._userRepo.GetUserByEmail(
            credentials.email.toLowerCase()
        );
        if (!existingUser) {
            throw new Error("AUTH ERROR");
        }
        const isValidPassword = this._cryptoService.VerifyPassword(
            credentials.password,
            existingUser.password_hash
        );
        if (!isValidPassword) {
            throw new Error("AUTH ERROR");
        }
        return this._tokenService.CreateAccessToken(existingUser.id);
    }
}
