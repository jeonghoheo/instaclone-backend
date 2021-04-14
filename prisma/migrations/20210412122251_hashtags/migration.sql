/*
  Warnings:

  - A unique constraint covering the columns `[hashtag]` on the table `HashTag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HashTag.hashtag_unique" ON "HashTag"("hashtag");
