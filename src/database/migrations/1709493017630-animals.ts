import { MigrationInterface, QueryRunner } from "typeorm";

export class Animals1709493017630 implements MigrationInterface {
    name = 'Animals1709493017630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "animals" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "unique_key" character varying(140) NOT NULL, "name" character varying(140) NOT NULL, "description" character varying(255) NOT NULL, "image_url" character varying(512) NOT NULL, "animal_category" character varying(140) NOT NULL, "animal_region" character varying(140) NOT NULL, "animal_conservation_status" character varying(140) NOT NULL, "base_market_chance" double precision NOT NULL DEFAULT '0.1', "base_hype_factor" double precision NOT NULL DEFAULT '0.1', "base_market_cost" integer NOT NULL DEFAULT '10000', CONSTRAINT "UQ_f0072560e84979b0be499844f97" UNIQUE ("unique_key"), CONSTRAINT "PK_6154c334bbb19186788468bce5c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "animals"`);
    }

}
