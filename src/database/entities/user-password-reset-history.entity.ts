import { Column, Entity, ManyToOne } from "typeorm";
import { AppBaseEntity } from "./base-entity";
import { UserEntity } from "./user.entity";

@Entity("user_password_reset_history")
export class UserPasswordResetHistoryEntity extends AppBaseEntity {
    @Column()
    token!: string;

    @Column({
        default: false,
    })
    used!: boolean;

    @ManyToOne(() => UserEntity)
    user!: UserEntity;
}