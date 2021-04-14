-- AlterTable
CREATE SEQUENCE "hashtag_id_seq";
ALTER TABLE "HashTag" ALTER COLUMN "id" SET DEFAULT nextval('hashtag_id_seq');
ALTER SEQUENCE "hashtag_id_seq" OWNED BY "HashTag"."id";
