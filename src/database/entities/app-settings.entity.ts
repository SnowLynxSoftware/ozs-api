import { Entity, Column } from "typeorm";
import { AppBaseEntity } from "./base-entity";

@Entity("app_settings")
export class AppSettingsEntity extends AppBaseEntity {
    @Column({
        default: true,
    })
    enable_emails!: boolean;

    @Column({
        default: false,
    })
    enable_maintenance_mode!: boolean;

    @Column({
        default: "Site Is Currently Under Maintenance!",
    })
    maintenance_mode_message!: string;
}
