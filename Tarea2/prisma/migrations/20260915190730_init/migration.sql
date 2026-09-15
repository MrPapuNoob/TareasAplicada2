-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encuesta" (
    "id" SERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,
    "opciones" JSONB NOT NULL,

    CONSTRAINT "Encuesta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voto" (
    "id" SERIAL NOT NULL,
    "opcion" TEXT NOT NULL,
    "encuestaId" INTEGER NOT NULL,

    CONSTRAINT "Voto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventario" (
    "id" SERIAL NOT NULL,
    "producto" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "stockMinimo" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "Inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turno" (
    "id" SERIAL NOT NULL,
    "cliente" TEXT NOT NULL,
    "servicio" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'esperando',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habito" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "meta" TEXT NOT NULL,

    CONSTRAINT "Habito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistroHabito" (
    "id" SERIAL NOT NULL,
    "fecha" TEXT NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT true,
    "habitoId" INTEGER NOT NULL,

    CONSTRAINT "RegistroHabito_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistroHabito_habitoId_fecha_key" ON "RegistroHabito"("habitoId", "fecha");

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_encuestaId_fkey" FOREIGN KEY ("encuestaId") REFERENCES "Encuesta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroHabito" ADD CONSTRAINT "RegistroHabito_habitoId_fkey" FOREIGN KEY ("habitoId") REFERENCES "Habito"("id") ON DELETE CASCADE ON UPDATE CASCADE;
