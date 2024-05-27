import { singleton } from "tsyringe";
import { TokenService } from "./token.service";
import { LoggingService } from "../../core-services/logging.service";

@singleton()
export class AuthorizationService {
    constructor(
        private readonly _tokenService: TokenService,
        private readonly _log: LoggingService
    ) {}

    // Simply verify the JWT and return the UserID associated with it.
    public async VerifyAccessTokenAndReturnUserID(
        accessToken: string
    ): Promise<number | null> {
        try {
            const userId =
                await this._tokenService.ValidateJWTToken(accessToken);
            if (userId && userId !== 0) {
                return parseInt(userId.toString());
            } else {
            }
            return null;
        } catch (error: any) {
            this._log.Logger.error(error);
            return null;
        }
    }
}
