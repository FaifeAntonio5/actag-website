-- CreateTable
CREATE TABLE "Noticia" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "imagem" TEXT,
    "categoria" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFormatada" TEXT,

    CONSTRAINT "Noticia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Galeria" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "legenda" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Galeria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtigoBlog" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "tempoLeitura" TEXT NOT NULL,
    "imagem" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArtigoBlog_pkey" PRIMARY KEY ("id")
);
