import { singleton } from "tsyringe";
import sgMail from "@sendgrid/mail";
import { EnvService } from "../../core-services/env.service";
import { LoggingService } from "../../core-services/logging.service";
import { SettingsService } from "../settings/settings.service";

@singleton()
export class EmailService {
    constructor(
        private readonly _envService: EnvService,
        private readonly _log: LoggingService,
        private readonly _settingsService: SettingsService
    ) {
        sgMail.setApiKey(this._envService.EmailProviderAPIKey);
    }

    private async _send(data: sgMail.MailDataRequired): Promise<boolean> {
        const settings = await this._settingsService.GetAllAppSettings();
        if (settings && settings.is_emails_enabled) {
            await sgMail.send(data);
        } else {
            this._log.Logger.info(
                "Emails are disabled in this environment. Skipping..."
            );
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
            this._log.Logger.error(error);
            return false;
        }
    }
}
