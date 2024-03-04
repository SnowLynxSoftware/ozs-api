/**
 * All animals will be in the database, but since database IDs can differ across
 * environments, we want an easy way to reference an animal by a key that doesn't change.
 */
export enum AnimalUniqueKey {
    // Mammals
    MAMMAL_RED_FOX = "mammal_red_fox",
    MAMMAL_FORMOSAN_BLACK_BEAR = "mammal_formosan_black_bear",
    MAMMAL_RACCOON = "mammal_raccoon",
    MAMMAL_BOBCAT = "mammal_bobcat",
    MAMMAL_COYOTE = "mammal_coyote",
    MAMMAL_GRAY_WOLF = "mammal_gray_wolf",
    MAMMAL_EASTERN_GRAY_SQUIRREL = "mammal_eastern_gray_squirrel",
    MAMMAL_SWAMP_RABBIT = "mammal_swamp_rabbit",
    MAMMAL_SEA_OTTER = "mammal_sea_otter",
}
