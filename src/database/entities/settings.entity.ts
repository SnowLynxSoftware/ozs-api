import { Entity, Column } from "typeorm";
import { AppBaseEntity } from "./base-entity";

@Entity("settings")
export class SettingsEntity extends AppBaseEntity {

    @Column({
        default: true,
    })
    is_emails_enabled!: boolean;

}
