-- CreateTable
CREATE TABLE "Informativo" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Informativo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Informativo_email_key" ON "Informativo"("email");
