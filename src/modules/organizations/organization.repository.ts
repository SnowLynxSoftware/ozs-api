import { singleton } from "tsyringe";
import { BaseRepository } from "../../database/repositories/base-repository";
import { Database } from "../../database/database.context";
import { OrganizationEntity } from "../../database/entities/organization.entity";
import { UserEntity } from "../../database/entities/user.entity";

@singleton()
export class OrganizationRepository extends BaseRepository {
    constructor(database: Database) {
        super(database, OrganizationEntity);
    }

    public async GetOrgById(id: number): Promise<OrganizationEntity> {
        return this._repo.findOne({
            where: { id },
            relations: ["owner", "admins", "contributors"],
        }) as unknown as OrganizationEntity;
    }

    public async CreateNewOrgWithOwner(
        name: string,
        owner: UserEntity
    ): Promise<OrganizationEntity | null> {
        const org = new OrganizationEntity();
        org.owner = owner;
        org.name = name;
        const result = await this._repo.insert(org);
        if (result && result.identifiers[0].id) {
            return this.GetOrgById(result.identifiers[0].id);
        } else {
            return null;
        }
    }
}
