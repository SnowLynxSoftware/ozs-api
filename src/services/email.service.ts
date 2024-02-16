import { singleton } from "tsyringe";
import sgMail from "@sendgrid/mail";
import { EnvService } from "./env.service";
import { NodeEnv } from "../models/enums/node-env.enum";

@singleton()
export class EmailService {
    constructor(private readonly _envService: EnvService) {
        sgMail.setApiKey(this._envService.EmailProviderAPIKey);
    }

    private async _send(data: sgMail.MailDataRequired): Promise<boolean> {
        if (this._envService.NodeEnv === NodeEnv.TESTS) {
            return true;
        } else {
            await sgMail.send(data);
        }
        return true;
    }

    public async SendEmailWithTemplate(
        templateHTML: string,
        subject: string,
        to: string
    ): Promise<boolean> {
        try {
            await this._send({
                to,
                from: "do-not-reply@openzoosim.com",
                subject,
                html: templateHTML,
            });
            return true;
        } catch (error: any) {
            console.error(error.message);
            return false;
        }
    }
}
