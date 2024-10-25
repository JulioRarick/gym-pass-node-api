-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER_MEMBER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER_MEMBER';
