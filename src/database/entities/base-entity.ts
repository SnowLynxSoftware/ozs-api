import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";

export class AppBaseEntity {
    @PrimaryGeneratedColumn({
        unsigned: true,
    })
    id!: number;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted!: Date;
}
