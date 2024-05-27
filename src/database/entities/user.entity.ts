import { Entity, Column } from "typeorm";
import { AppBaseEntity } from "./base-entity";

@Entity("users")
export class UserEntity extends AppBaseEntity {
    @Column({
        unique: true,
        length: 255,
    })
    email!: string;

    @Column({
        length: 50,
    })
    name!: string;

    @Column({
        length: 512,
    })
    password_hash!: string;

    @Column({
        default: false,
    })
    verified!: boolean;

    @Column({
        nullable: true,
    })
    last_login!: Date;

    @Column({
        default: 0,
    })
    fail_attempts!: number;

    @Column({
        default: null,
    })
    auth_lockout_until!: Date;
}
