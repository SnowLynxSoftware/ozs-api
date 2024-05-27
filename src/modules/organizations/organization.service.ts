import { singleton } from "tsyringe";
import { OrganizationRepository } from "./organization.repository";
import { OrganizationEntity } from "../../database/entities/organization.entity";
import { UserRepository } from "../users/user.repository";

@singleton()
export class OrganizationService {
    constructor(
        private readonly _orgRepo: OrganizationRepository,
        private readonly _userRepo: UserRepository
    ) {}

    public async CreateNewOrg(
        ownerId: number,
        name: string
    ): Promise<OrganizationEntity> {
        const owner = await this._userRepo.GetUserByID(ownerId);
        if (!owner) {
            throw new Error(
                `Owner: [${ownerId}] not found when creating new organization!`
            );
        }

        const org = await this._orgRepo.CreateNewOrgWithOwner(name, owner);
        if (!org) {
            throw new Error(
                `An error occurred when attempting to create a new organization for Owner: [${ownerId}]`
            );
        }

        return org;
    }
}
