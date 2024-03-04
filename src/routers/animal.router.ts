import { BaseRouter } from "./base.router";
import { Request, Response, NextFunction } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { ValidationError } from "../errors/validation.error";
import { AnimalImportService } from "../services/core/animal-import.service";
import { AnimalEntity } from "../database/entities/animal.entity";
import { singleton } from "tsyringe";

@singleton()
export class AnimalRouter extends BaseRouter {
    constructor(private readonly _animalImportService: AnimalImportService) {
        super("/animals");
        this._buildRoutes();
    }

    private async _importAnimals(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const animals = req.body;
            if (animals && animals.length > 0) {
                const results = await this._animalImportService.ImportAnimals(
                    animals as AnimalEntity[]
                );
                res.json(results);
            } else {
                throw new ValidationError("Animals are required for import!");
            }
        } catch (error: any) {
            next(error);
        }
    }

    private _buildRoutes() {
        this.Router.post(
            "/import",
            AuthMiddleware.Authorize,
            this._importAnimals.bind(this)
        );
    }
}
