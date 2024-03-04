import { singleton } from "tsyringe";
import { BaseRepository } from "./base-repository";
import { Database } from "../database.context";
import { AnimalEntity } from "../entities/animal.entity";
import { AnimalUniqueKey } from "../../models/enums/animal-unique-key.enum";
import { AnimalCategory } from "../../models/enums/animal-category.enum";
import { AnimalRegion } from "../../models/enums/animal-region.enum";
import { AnimalConservationStatus } from "../../models/enums/animal-conservation-status.enum";

@singleton()
export class AnimalRepository extends BaseRepository {
    constructor(database: Database) {
        super(database, AnimalEntity);
    }

    public async GetAnimalByID(id: number): Promise<AnimalEntity | null> {
        return this._repo.findOneBy({
            id,
        }) as unknown as AnimalEntity;
    }

    public async GetAnimalByKey(
        unique_key: AnimalUniqueKey
    ): Promise<AnimalEntity | null> {
        return this._repo.findOneBy({
            unique_key,
        }) as unknown as AnimalEntity;
    }

    public async CreateAnimal(
        unique_key: AnimalUniqueKey,
        name: string,
        description: string,
        image_url: string,
        animal_category: AnimalCategory,
        animal_region: AnimalRegion,
        animal_conservation_status: AnimalConservationStatus,
        base_market_chance: number,
        base_hype_factor: number,
        base_market_cost: number
    ): Promise<AnimalEntity | null> {
        const animal = new AnimalEntity();
        animal.unique_key = unique_key;
        animal.name = name;
        animal.description = description;
        animal.image_url = image_url;
        animal.animal_category = animal_category;
        animal.animal_region = animal_region;
        animal.animal_conservation_status = animal_conservation_status;
        animal.base_market_chance = base_market_chance;
        animal.base_hype_factor = base_hype_factor;
        animal.base_market_cost = base_market_cost;
        const result = await this._repo.insert(animal);
        if (result && result.identifiers[0].id) {
            return this.GetAnimalByID(result.identifiers[0].id);
        } else {
            return null;
        }
    }

    public async UpdateAnimal(
        animal: AnimalEntity
    ): Promise<AnimalEntity | null> {
        const result = await this._repo.save(animal);
        if (result) {
            return this.GetAnimalByID(animal.id);
        } else {
            return null;
        }
    }
}
