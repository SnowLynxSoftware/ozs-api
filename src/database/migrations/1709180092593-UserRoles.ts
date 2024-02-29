import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRoles1709180092593 implements MigrationInterface {
    name = "UserRoles1709180092593";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user_roles" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "role_key" character varying(64) NOT NULL, "name" character varying(64) NOT NULL, "description" character varying(140) NOT NULL, "privileges_raw" character varying(512) NOT NULL DEFAULT '[]', CONSTRAINT "UQ_b405e24f7cc02ce90b5b427e357" UNIQUE ("role_key"), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "user_roles_user_users" ("userRolesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_fd725df1e8aeb825cd52d7bf9d6" PRIMARY KEY ("userRolesId", "usersId"))`
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_c51a5ba28fe353c0254a3ec12b" ON "user_roles_user_users" ("userRolesId") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_db6bb6f152685b8d590c0d0698" ON "user_roles_user_users" ("usersId") `
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles_user_users" ADD CONSTRAINT "FK_c51a5ba28fe353c0254a3ec12b7" FOREIGN KEY ("userRolesId") REFERENCES "user_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles_user_users" ADD CONSTRAINT "FK_db6bb6f152685b8d590c0d06982" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );

        // Seed Data
        await queryRunner.query(
            `INSERT INTO public.user_roles(role_key, name, description) VALUES('administrator', 'Administrator', 'Super User Administrator Full Access')`
        );
        await queryRunner.query(
            `INSERT INTO public.user_roles(role_key, name, description) VALUES('support', 'Support Staff', 'Support Staff')`
        );
        await queryRunner.query(
            `INSERT INTO public.user_roles(role_key, name, description) VALUES('pro_player', 'Pro Player', 'Pro Player')`
        );
        await queryRunner.query(
            `INSERT INTO public.user_roles(role_key, name, description) VALUES('free_player', 'Player', 'Free Player')`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_roles_user_users" DROP CONSTRAINT "FK_db6bb6f152685b8d590c0d06982"`
        );
        await queryRunner.query(
            `ALTER TABLE "user_roles_user_users" DROP CONSTRAINT "FK_c51a5ba28fe353c0254a3ec12b7"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_db6bb6f152685b8d590c0d0698"`
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_c51a5ba28fe353c0254a3ec12b"`
        );
        await queryRunner.query(`DROP TABLE "user_roles_user_users"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
    }
}
