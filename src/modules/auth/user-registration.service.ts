import { singleton } from "tsyringe";
import { UserRepository } from "../users/user.repository";
import { userRegistrationTemplate } from "../email/templates/user-registration.template";
import { CryptoService } from "./crypto.service";
import { TokenService } from "./token.service";
import { EmailService } from "../email/email.service";
import { EnvService } from "../../core-services/env.service";

@singleton()
export class UserRegistrationService {
    constructor(
        private readonly _userRepo: UserRepository,
        private readonly _cryptoService: CryptoService,
        private readonly _tokenService: TokenService,
        private readonly _emailService: EmailService,
        private readonly _envService: EnvService
    ) {}

    // TODO: DTO
    public async RegisterNewUserRequest(registerRequest: any): Promise<any> {
        const existingUser = await this._userRepo.GetUserByEmail(
            registerRequest.email.toLowerCase()
        );
        if (existingUser) {
            return {
                email: registerRequest.email,
                status: 400,
                message: "An error occurred when attempting to register.",
            };
        } else {
            const hash = await this._cryptoService.HashPassword(
                registerRequest.password
            );
            const newUser = await this._userRepo.CreateUser(
                registerRequest.email.toLowerCase(),
                registerRequest.name,
                hash
            );
            if (!newUser) {
                return {
                    email: registerRequest.email,
                    status: 500,
                    message:
                        "An error occurred when attempting to create your user. Please try again or contact support if the problem persists!",
                };
            } else {
                const verificationToken =
                    await this._tokenService.CreateJWTVerificationToken(
                        newUser.id
                    );
                const emailResult =
                    await this._emailService.SendEmailWithTemplate(
                        userRegistrationTemplate({
                            Email: newUser.email.toLowerCase(),
                            URL:
                                this._envService.AppBaseAPIURL +
                                "/v1/auth/verify?token=" +
                                verificationToken,
                        }),
                        "VistaTable - Verify Your Account!",
                        newUser.email.toLowerCase()
                    );
                if (emailResult) {
                    return {
                        email: registerRequest.email.toLowerCase(),
                        status: 201,
                        message:
                            "An email has been sent to your inbox. Please click the link in the email to verify your account!",
                    };
                } else {
                    return {
                        email: registerRequest.email.toLowerCase(),
                        status: 201,
                        message:
                            "Your account was created but an error occurred when attempting to send the verification email. Please use the FORGOT YOUR PASSWORD functionality to continue or contact support.",
                    };
                }
            }
        }
    }

    public async UserVerification(verificationToken: string): Promise<string> {
        const userID =
            await this._tokenService.ValidateJWTToken(verificationToken);
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
