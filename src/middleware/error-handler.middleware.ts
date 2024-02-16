import { NextFunction, Request, Response } from "express";
import { AuthError } from "../errors/auth.error";
import { ForbiddenError } from "../errors/forbidden.error";
import { ValidationError } from "../errors/validation.error";

export class ErrorHandlerMiddleware {
    public static async HandleErrors(
        error: Error,
        _req: Request,
        res: Response,
        _next: NextFunction
    ) {
        if (error instanceof AuthError) {
            res.status(401).json({
                message: "You are not logged in! - " + error.message,
            });
        } else if (error instanceof ForbiddenError) {
            res.status(403).json({
                message:
                    "You do not have permission to view this resource! - " +
                    error.message,
            });
        } else if (error instanceof ValidationError) {
            res.status(400).json({
                message:
                    "Validation Checks Failed - BAD REQUEST! - " +
                    error.message,
            });
        } else {
            res.status(500).json({
                message: "An error has occurred! - " + error.message,
            });
        }
    }
}
