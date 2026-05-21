-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membro" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Membro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voluntario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "projecto" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Em Espera',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Voluntario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "montante" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Doador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contacto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "assunto" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doacao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "montante" DOUBLE PRECISION NOT NULL,
    "frequencia" TEXT NOT NULL,
    "metodo" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Doacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Membro_email_key" ON "Membro"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Voluntario_email_key" ON "Voluntario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Doador_email_key" ON "Doador"("email");
