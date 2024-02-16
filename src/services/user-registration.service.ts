import { singleton } from "tsyringe";
import { UserRepository } from "../database/repositories/user.repository";
import { CryptoService } from "./crypto.service";
import { TokenService } from "./token.service";
import { EmailService } from "./email.service";
import { userRegistrationTemplate } from "../email_templates/user-registration.template";
import { EnvService } from "./env.service";

@singleton()
export class UserRegistrationService {
    constructor(
        private readonly _userRepo: UserRepository,
        private readonly _cryptoService: CryptoService,
        private readonly _tokenService: TokenService,
        private readonly _emailService: EmailService,
        private readonly _envService: EnvService
    ) {}

    public async RegisterNewUserRequest(
        email: string,
        password: string
    ): Promise<string> {
        const existingUser = await this._userRepo.GetUserByEmail(email);
        if (existingUser) {
            return "This user already exists--please login or reset your password!";
        } else {
            const hash = await this._cryptoService.HashPassword(password);
            const newUser = await this._userRepo.CreateUser(
                email.toLowerCase(),
                hash
            );
            if (!newUser) {
                return "An error occurred when attempting to create your user. Please try again or contact support if the problem persists!";
            } else {
                const verificationToken =
                    await this._tokenService.CreateVerificationToken(
                        newUser.id
                    );
                const emailResult =
                    await this._emailService.SendEmailWithTemplate(
                        userRegistrationTemplate({
                            Email: newUser.email.toLowerCase(),
                            URL:
                                this._envService.AppBaseAPIURL +
                                "/auth/verify?token=" +
                                verificationToken,
                        }),
                        "VistaTable - Verify Your Account!",
                        newUser.email.toLowerCase()
                    );
                if (emailResult) {
                    return "An email has been sent to your inbox. Please click the link in the email to verify your account!";
                } else {
                    return "Your account was created but an error occurred when attempting to send the verification email. Please use the FORGOT YOUR PASSWORD functionality to continue or contact support.";
                }
            }
        }
    }

    public async UserVerification(verificationToken: string): Promise<string> {
        const userID =
            await this._tokenService.ValidateToken(verificationToken);
        if (userID) {
            const existingUser = await this._userRepo.GetUserByID(userID);
            if (existingUser) {
                existingUser.verified = true;
                await this._userRepo.UpdateUser(existingUser);
                return "Your account was successfully verified. You can now login!";
            } else {
                throw new Error("User Verification Failed!");
            }
        } else {
            throw new Error("User Verification Failed!");
        }
    }
}
