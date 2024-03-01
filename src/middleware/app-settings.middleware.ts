import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { AppSettingsService } from "../services/app-settings.service";

export class AppSettingsMiddleware {
    public static async ValidateAppSettings(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const appSettingsService = container.resolve(AppSettingsService);
            const appSettings = await appSettingsService.GetAppSettings();
            // @ts-ignore
            req.app_settings = appSettings;

            // If maintenance mode is enabled--we will hijack the request here.
            // Otherwise, continue...
            if (appSettings.enable_maintenance_mode) {
                res.send(`<html>
                <head>
                    <style>
                        @import url(https://fonts.bunny.net/css?family=abel:400|adamina:400|prompt:100i,200i,300,300i,400,400i,500,500i,600,600i,700,800);
                        html, body {
                            font-family: 'Abel', sans-serif;
                            font-family: 'Adamina', serif;
                            font-family: 'Prompt', sans-serif;
                        }
                        .container {
                            width: 50%;
                            margin: 100px auto;
                            border: 1px solid black;
                            box-shadow: 1px 2px 3px gray;
                            padding: 15px;                            
                        }
                        .container h1 {
                            text-align: center;
                        }
                        .container p {
                            text-align: center;
                            font-size: 1.2rem;
                        }                      
                    </style>
                </head>
                    <body>
                        <div class="container">
                            <h1>OpenZooSim Maintenance Mode</h1>
                            <p>${appSettings.maintenance_mode_message}</p>
                        </div>
                    </body>
                </html>`);
            } else {
                next();
            }
        } catch (error) {
            next(error);
        }
    }
}
