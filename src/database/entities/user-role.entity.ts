import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { AppBaseEntity } from "./base-entity";
import { UserEntity } from "./user.entity";

@Entity("user_roles")
export class UserRoleEntity extends AppBaseEntity {
    @Column({
        length: 64,
        unique: true,
    })
    role_key!: string;

    @Column({
        length: 64,
    })
    name!: string;

    @Column({
        length: 140,
    })
    description!: string;

    @Column({
        length: 512,
        default: "[]",
    })
    privileges_raw!: string;

    @ManyToMany(() => UserEntity)
    @JoinTable()
    user!: UserEntity;

    public GetPrivileges(): string[] {
        if (this.privileges_raw) {
            return JSON.parse(this.privileges_raw);
        } else {
            return [];
        }
    }
}
