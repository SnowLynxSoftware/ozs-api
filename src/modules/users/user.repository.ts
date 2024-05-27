import { singleton } from "tsyringe";
import { BaseRepository } from "../../database/repositories/base-repository";
import { Database } from "../../database/database.context";
import { UserEntity } from "../../database/entities/user.entity";
import { Like } from "typeorm";

@singleton()
export class UserRepository extends BaseRepository {
    constructor(database: Database) {
        super(database, UserEntity);
    }

    public async GetUsersWithSearch(
        searchQuery: string,
        skip: number,
        take: number
    ) {
        const [items, count] = await this._repo.findAndCount({
            where: {
                email: Like(`%${searchQuery}%`),
            },
            take,
            skip,
        });
        return {
            items,
            count,
        };
    }

    public async GetUserByID(id: number): Promise<UserEntity | null> {
        return this._repo.findOneBy({
            id,
        }) as unknown as UserEntity;
    }

    public async GetUserByEmail(email: string): Promise<UserEntity | null> {
        return this._repo.findOneBy({
            email,
        }) as unknown as UserEntity;
    }

    public async CreateUser(
        email: string,
        name: string,
        hash: string
    ): Promise<UserEntity | null> {
        const user = new UserEntity();
        user.email = email;
        user.name = name;
        user.password_hash = hash;
        const result = await this._repo.insert(user);
        if (result && result.identifiers[0].id) {
            return this.GetUserByID(result.identifiers[0].id);
        } else {
            return null;
        }
    }

    public async UpdateUser(user: UserEntity): Promise<UserEntity | null> {
        const result = await this._repo.save(user);
        if (result) {
            return this.GetUserByID(user.id);
        } else {
            return null;
        }
    }
}
