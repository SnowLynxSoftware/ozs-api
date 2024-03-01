import { MigrationInterface, QueryRunner } from "typeorm";

export class AppSettings1709265002208 implements MigrationInterface {
    name = "AppSettings1709265002208";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "app_settings" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "enable_emails" boolean NOT NULL DEFAULT true, "enable_maintenance_mode" boolean NOT NULL DEFAULT false, "maintenance_mode_message" character varying NOT NULL DEFAULT 'Site Is Currently Under Maintenance!', CONSTRAINT "PK_4800b266ba790931744b3e53a74" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `INSERT INTO public.app_settings (enable_emails) VALUES('true')`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "app_settings"`);
    }
}
