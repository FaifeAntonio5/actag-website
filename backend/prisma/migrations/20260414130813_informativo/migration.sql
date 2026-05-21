/*
  Warnings:

  - Added the required column `nome` to the `Informativo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Informativo" ADD COLUMN     "nome" TEXT NOT NULL;
