import { Entity, ManyToOne } from "typeorm";
import { AppBaseEntity } from "./base-entity";
import { UserEntity } from "./user.entity";

@Entity("user_auth_history")
export class UserAuthHistoryEntity extends AppBaseEntity {
    @ManyToOne(() => UserEntity)
    user!: UserEntity;
}
