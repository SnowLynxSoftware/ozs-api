import { Entity, Column } from "typeorm";
import { AppBaseEntity } from "./base-entity";
import { AnimalUniqueKey } from "../../models/enums/animal-unique-key.enum";
import { AnimalCategory } from "../../models/enums/animal-category.enum";
import { AnimalRegion } from "../../models/enums/animal-region.enum";
import { AnimalConservationStatus } from "../../models/enums/animal-conservation-status.enum";

@Entity("animals")
export class AnimalEntity extends AppBaseEntity {
    @Column({
        unique: true,
        length: 140,
    })
    unique_key!: AnimalUniqueKey;

    @Column({
        length: 140,
    })
    name!: string;

    @Column({
        length: 255,
    })
    description!: string;

    @Column({
        length: 512,
    })
    image_url!: string;

    @Column({
        length: 140,
    })
    animal_category!: AnimalCategory;

    @Column({
        length: 140,
    })
    animal_region!: AnimalRegion;

    @Column({
        length: 140,
    })
    animal_conservation_status!: AnimalConservationStatus;

    @Column({
        default: 0.1,
        type: "float",
    })
    base_market_chance!: number;

    @Column({
        default: 0.1,
        type: "float",
    })
    base_hype_factor!: number;

    @Column({
        default: 10000,
        type: "integer",
    })
    base_market_cost!: number;
}
