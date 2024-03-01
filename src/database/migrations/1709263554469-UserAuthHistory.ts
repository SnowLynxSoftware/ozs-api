import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAuthHistory1709263554469 implements MigrationInterface {
    name = 'UserAuthHistory1709263554469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_auth_history" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "userId" integer, CONSTRAINT "PK_6154880377e08845c58bb0bb392" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "fail_attempts" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "auth_lockout_until" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_auth_history" ADD CONSTRAINT "FK_e8e619725a6c85b0aa85cae8de4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_auth_history" DROP CONSTRAINT "FK_e8e619725a6c85b0aa85cae8de4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "auth_lockout_until"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fail_attempts"`);
        await queryRunner.query(`DROP TABLE "user_auth_history"`);
    }

}
