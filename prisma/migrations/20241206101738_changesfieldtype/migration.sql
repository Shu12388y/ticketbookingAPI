/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trainNumber]` on the table `CreateTrainJourneyDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[TrainNumber]` on the table `TicketDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CreateTrainJourneyDetail_trainNumber_key" ON "CreateTrainJourneyDetail"("trainNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TicketDetails_TrainNumber_key" ON "TicketDetails"("TrainNumber");
