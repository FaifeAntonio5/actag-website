/*
  Warnings:

  - You are about to drop the column `email` on the `Doacao` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Doacao` table. All the data in the column will be lost.
  - You are about to drop the column `montante` on the `Doador` table. All the data in the column will be lost.
  - Added the required column `doadorId` to the `Doacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doacao" DROP COLUMN "email",
DROP COLUMN "nome",
ADD COLUMN     "doadorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Doador" DROP COLUMN "montante";

-- AddForeignKey
ALTER TABLE "Doacao" ADD CONSTRAINT "Doacao_doadorId_fkey" FOREIGN KEY ("doadorId") REFERENCES "Doador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
