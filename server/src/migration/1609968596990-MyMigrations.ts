import {MigrationInterface, QueryRunner} from "typeorm";

export class MyMigrations1609968596990 implements MigrationInterface {
    name = 'MyMigrations1609968596990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "beat" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "creator" character varying NOT NULL, "beat" character varying NOT NULL, "postId" integer, CONSTRAINT "PK_05c060832980df03a71fd2c8322" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "beat" ADD CONSTRAINT "FK_ff91c942714bf2a87f200daa3c0" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "beat" DROP CONSTRAINT "FK_ff91c942714bf2a87f200daa3c0"`);
        await queryRunner.query(`DROP TABLE "beat"`);
    }

}
