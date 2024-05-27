import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { AppBaseEntity } from "./base-entity";
import { UserEntity } from "./user.entity";

@Entity("organizations")
export class OrganizationEntity extends AppBaseEntity {
    @Column({
        length: 40,
    })
    name!: string;

    @ManyToMany(() => UserEntity)
    @JoinTable()
    admins!: UserEntity[];

    @ManyToMany(() => UserEntity)
    @JoinTable()
    contributors!: UserEntity[];

    @ManyToOne(() => UserEntity)
    owner!: UserEntity;
}
