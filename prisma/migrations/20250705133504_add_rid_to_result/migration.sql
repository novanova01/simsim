/*
  Warnings:

  - A unique constraint covering the columns `[rid]` on the table `Result` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rid` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `result` ADD COLUMN `rid` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Result_rid_key` ON `Result`(`rid`);
