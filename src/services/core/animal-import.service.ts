import { injectable } from "tsyringe";
import { AnimalRepository } from "../../database/repositories/animal.repository";
import { AnimalEntity } from "../../database/entities/animal.entity";
import { LoggingService } from "../logging.service";
import { ValidationError } from "../../errors/validation.error";

export interface IAnimalImportResults {
    errors: string[];
    updates: AnimalEntity[];
    inserts: AnimalEntity[];
}

@injectable()
export class AnimalImportService {
    constructor(
        private readonly _animalRepository: AnimalRepository,
        private readonly _log: LoggingService
    ) {}

    public async ImportAnimals(
        animals: AnimalEntity[]
    ): Promise<IAnimalImportResults> {
        console.time("Animal Import Time");
        this._log.Logger.debug(
            `Animal Import Service is preparing a new import with [${animals.length}] animals!`
        );

        const errors: string[] = [];
        const updates: AnimalEntity[] = [];
        const inserts: AnimalEntity[] = [];

        for (const animal of animals) {
            try {
                this._log.Logger.debug(
                    `[${animal.unique_key}] - Checking if exists...`
                );

                let existingAnimal = null;

                if (animal.unique_key) {
                    existingAnimal =
                        await this._animalRepository.GetAnimalByKey(
                            animal.unique_key
                        );
                } else {
                    throw new ValidationError("Unique Key is required!");
                }

                // If this animal already exists, update it.
                if (existingAnimal) {
                    this._log.Logger.debug(
                        `[${animal.unique_key}] - Already Exists... [ID: ${existingAnimal.id}] - Updating...`
                    );
                    const mergedProperties = Object.assign(
                        existingAnimal,
                        animal
                    );

                    mergedProperties.updated = new Date(Date.now());
                    const updatedAnimal =
                        await this._animalRepository.UpdateAnimal(
                            mergedProperties
                        );
                    if (updatedAnimal) {
                        updates.push(updatedAnimal);
                        this._log.Logger.debug(
                            `[${animal.unique_key}] - [ID: ${existingAnimal.id}] - Update Success...`
                        );
                    } else {
                        errors.push(animal.unique_key);
                        this._log.Logger.warn(
                            `[${animal.unique_key}] - [ID: ${existingAnimal.id}] - Update Failed...`
                        );
                    }
                } else {
                    // Otherwise, insert a new animal
                    this._log.Logger.debug(
                        `[${animal.unique_key}] - New Animal Detected - Inserting...`
                    );
                    const newAnimal = await this._animalRepository.CreateAnimal(
                        animal.unique_key,
                        animal.name,
                        animal.description,
                        animal.image_url,
                        animal.animal_category,
                        animal.animal_region,
                        animal.animal_conservation_status,
                        animal.base_market_chance,
                        animal.base_hype_factor,
                        animal.base_market_cost
                    );
                    if (newAnimal) {
                        inserts.push(newAnimal);
                        this._log.Logger.debug(
                            `[${animal.unique_key}] - [ID: ${newAnimal.id}] - Insert Success...`
                        );
                    } else {
                        errors.push(animal.unique_key);
                        this._log.Logger.warn(
                            `[${animal.unique_key}] - Insert Failed...`
                        );
                    }
                }
            } catch (error: any) {
                this._log.Logger.error(error.message);
                errors.push(error.message);
            }
        }

        this._log.Logger.info(
            `Import Complete - ERRORS: [${errors.length}] - UPDATES: [${updates.length}] - INSERTS: [${inserts.length}]`
        );
        console.timeEnd("Animal Import Time");

        return {
            errors,
            updates,
            inserts,
        };
    }
}
