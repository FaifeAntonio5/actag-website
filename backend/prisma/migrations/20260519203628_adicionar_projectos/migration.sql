-- CreateTable
CREATE TABLE "Projecto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Activo',
    "progresso" INTEGER NOT NULL DEFAULT 0,
    "meta" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "orcamento" DOUBLE PRECISION,
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFim" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectoMembro" (
    "id" SERIAL NOT NULL,
    "funcao" TEXT NOT NULL,
    "projectoId" INTEGER NOT NULL,
    "membroId" INTEGER NOT NULL,

    CONSTRAINT "ProjectoMembro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectoFinanciador" (
    "id" SERIAL NOT NULL,
    "nomeEntidade" TEXT NOT NULL,
    "montante" DOUBLE PRECISION,
    "tipoApoio" TEXT NOT NULL,
    "contacto" TEXT,
    "projectoId" INTEGER NOT NULL,

    CONSTRAINT "ProjectoFinanciador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectoParceiro" (
    "id" SERIAL NOT NULL,
    "nomeEntidade" TEXT NOT NULL,
    "tipoParticipacao" TEXT NOT NULL,
    "contacto" TEXT,
    "projectoId" INTEGER NOT NULL,

    CONSTRAINT "ProjectoParceiro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectoMembro_projectoId_membroId_key" ON "ProjectoMembro"("projectoId", "membroId");

-- AddForeignKey
ALTER TABLE "ProjectoMembro" ADD CONSTRAINT "ProjectoMembro_projectoId_fkey" FOREIGN KEY ("projectoId") REFERENCES "Projecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectoMembro" ADD CONSTRAINT "ProjectoMembro_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectoFinanciador" ADD CONSTRAINT "ProjectoFinanciador_projectoId_fkey" FOREIGN KEY ("projectoId") REFERENCES "Projecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectoParceiro" ADD CONSTRAINT "ProjectoParceiro_projectoId_fkey" FOREIGN KEY ("projectoId") REFERENCES "Projecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
