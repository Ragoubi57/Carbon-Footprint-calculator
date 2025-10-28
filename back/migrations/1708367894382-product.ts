import { MigrationInterface, QueryRunner } from "typeorm";

export class Product1708367894382 implements MigrationInterface {
  name = "Product1708367894382";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "products" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "ingredients" jsonb NOT NULL,
        "totalCarbonFootprint" float,
        "breakdown" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_products" PRIMARY KEY ("id")
      )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products"`);
  }
}