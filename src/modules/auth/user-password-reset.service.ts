import { singleton } from "tsyringe";
import { UserRepository } from "../users/user.repository";
import { TokenService } from "./token.service";
import { EmailService } from "../email/email.service";
import { EnvService } from "../../core-services/env.service";
import { LoggingService } from "../../core-services/logging.service";
import { CryptoService } from "./crypto.service";
import { UserPasswordResetHistoryRepository } from "./user-password-reset-history.repository";
import { userPasswordResetTemplate } from "../email/templates/user-password-reset.template";

@singleton()
export class UserPasswordResetService {
    constructor(
        private readonly _userRepo: UserRepository,
        private readonly _tokenService: TokenService,
        private readonly _emailService: EmailService,
        private readonly _envService: EnvService,
        private readonly _log: LoggingService,
        private readonly _cryptoService: CryptoService,
        private readonly _passwordResetRepo: UserPasswordResetHistoryRepository
    ) {}

    // TODO: DTO
    public async UserPasswordResetRequest(email: string): Promise<any> {
        const existingUser = await this._userRepo.GetUserByEmail(
            email.toLowerCase()
        );
        // If we don't find a user, just return a generic message for security purposes.
        if (!existingUser) {
            this._log.Logger.warn(
                "A user could not be found to perform a password reset! " +
                    email
            );
            return {
                email: email,
                status: 200,
                message:
                    "If we found an account with the specified email address, you will receive an email shortly with instructions on how to reset your password!",
            };
        } else {
            const verificationToken =
                await this._tokenService.CreateJWTVerificationToken(
                    existingUser.id
                );
            await this._passwordResetRepo.CreateUserPasswordResetHistoryEntryForUser(
                existingUser,
                verificationToken
            );
            const emailResult = await this._emailService.SendEmailWithTemplate(
                userPasswordResetTemplate({
                    Email: existingUser.email.toLowerCase(),
                    URL:
                        this._envService.AppBaseAPIURL +
                        "/v1/auth/password-reset-verification?token=" +
                        verificationToken,
                }),
                "VistaTable - Reset Your Password!",
                existingUser.email.toLowerCase()
            );
            // If the email failed to send, we should log it--
            if (!emailResult) {
                this._log.Logger.error(
                    "A password reset request occurred--but the email failed to send! " +
                        email
                );
            }
            return {
                email: existingUser.email.toLowerCase(),
                status: 200,
                message:
                    "If we found an account with the specified email address, you will receive an email shortly with instructions on how to reset your password!",
            };
        }
    }

    public async PasswordResetUserVerification(
        verificationToken: string
    ): Promise<string> {
        const userID =
            await this._tokenService.ValidateJWTToken(verificationToken);
        if (userID) {
            const existingUser = await this._userRepo.GetUserByID(userID);
            if (existingUser) {
                // Also make sure that we haven't used this token before
                const history =
                    await this._passwordResetRepo.GetPasswordResetHistoryByToken(
                        verificationToken
                    );

                if (history && history.used) {
                    throw new Error(
                        `Cannot reset user's password: ${existingUser.email} - Token already used!`
                    );
                }

                const newPassword =
                    this._cryptoService.GenerateRandomString(16);

                const hashedPassword =
                    await this._cryptoService.HashPassword(newPassword);

                existingUser.password_hash = hashedPassword;
                await this._userRepo.UpdateUser(existingUser);
                await this._passwordResetRepo.UpdateHistoryItemAsUsed(
                    verificationToken
                );
                return `Your password has been successfully reset! You can now log in using your temporary password: <br /><br />
                ${newPassword} <br /><br />
                Please copy this someplace safe as you won't be able to see it again!`;
            } else {
                throw new Error("User Verification Failed!");
            }
        } else {
            throw new Error("User Verification Failed!");
        }
    }
}
