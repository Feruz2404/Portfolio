-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "translations" JSONB;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "translations" JSONB;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "translations" JSONB;

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "department" TEXT,
ADD COLUMN     "shortBio" TEXT,
ADD COLUMN     "translations" JSONB;

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");
