-- CreateTable
CREATE TABLE "ApiKey" (
    "id" SERIAL NOT NULL,
    "apikey" TEXT NOT NULL,
    "adminid" INTEGER NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_adminid_fkey" FOREIGN KEY ("adminid") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
