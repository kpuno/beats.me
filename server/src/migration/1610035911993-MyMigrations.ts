import {MigrationInterface, QueryRunner} from "typeorm";

export class MyMigrations1610035911993 implements MigrationInterface {
    name = 'MyMigrations1610035911993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "beat" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "beat" DROP CONSTRAINT "PK_13d854051fb0f9d69094f057f3d"`);
        await queryRunner.query(`ALTER TABLE "beat" ADD CONSTRAINT "PK_400e0cf80aa3ff4fc86a8de806f" PRIMARY KEY ("userId", "postId", "id")`);
        await queryRunner.query(`ALTER TABLE "beat" DROP CONSTRAINT "FK_ff91c942714bf2a87f200daa3c0"`);
        await queryRunner.query(`COMMENT ON COLUMN "beat"."userId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "beat" DROP CONSTRAINT "PK_400e0cf80aa3ff4fc86a8de806f"`);
        await queryRunner.query(`ALTER TABLE "beat" ADD CONSTRAINT "PK_3a4b36ab00a1062013f084fea17" PRIMARY KEY ("postId", "id")`);
        await queryRunner.query(`COMMENT ON COLUMN "beat"."postId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "beat" DROP CONSTRAINT "PK_3a4b36ab00a1062013f084fea17"`);
        await queryRunner.query(`ALTER TABLE "beat" ADD CONSTRAINT "PK_05c060832980df03a71fd2c8322" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "beat" ADD CONSTRAINT "FK_ff91c942714bf2a87f200daa3c0" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "beat" DROP CONSTRAINT "FK_ff91c942714bf2a87f200daa3c0"`);
        await queryRunner.query(`ALTER TABLE "beat" DROP CONSTRAINT "PK_05c060832980df03a71fd2c8322"`);
        await queryRunner.query(`ALTER TABLE "beat" ADD CONSTRAINT "PK_3a4b36ab00a1062013f084fea17" PRIMARY KEY ("postId", "id")`);
        await queryRunner.query(`COMMENT ON COLUMN "beat"."postId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "beat" DROP CONSTRAINT "PK_3a4b36ab00a1062013f084fea17"`);
        await queryRunner.query(`ALTER TABLE "beat" ADD CONSTRAINT "PK_400e0cf80aa3ff4fc86a8de806f" PRIMARY KEY ("userId", "postId", "id")`);
        await queryRunner.query(`COMMENT ON COLUMN "beat"."userId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "beat" ADD CONSTRAINT "FK_ff91c942714bf2a87f200daa3c0" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "beat" DROP CONSTRAINT "PK_400e0cf80aa3ff4fc86a8de806f"`);
        await queryRunner.query(`ALTER TABLE "beat" ADD CONSTRAINT "PK_13d854051fb0f9d69094f057f3d" PRIMARY KEY ("userId", "postId")`);
        await queryRunner.query(`ALTER TABLE "beat" DROP COLUMN "id"`);
    }

}
