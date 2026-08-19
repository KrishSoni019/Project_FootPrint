-- CreateEnum
CREATE TYPE "ManualActivityType" AS ENUM ('RESEARCH', 'DOCUMENTATION', 'TESTING', 'DESIGN', 'MEETING');

-- CreateTable
CREATE TABLE "ManualActivity" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "type" "ManualActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "evidenceUrl" TEXT,
    "activityDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManualActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ManualActivity_projectId_idx" ON "ManualActivity"("projectId");

-- CreateIndex
CREATE INDEX "ManualActivity_memberId_idx" ON "ManualActivity"("memberId");

-- CreateIndex
CREATE INDEX "ManualActivity_projectId_activityDate_idx" ON "ManualActivity"("projectId", "activityDate");

-- AddForeignKey
ALTER TABLE "ManualActivity" ADD CONSTRAINT "ManualActivity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualActivity" ADD CONSTRAINT "ManualActivity_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "ProjectMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
