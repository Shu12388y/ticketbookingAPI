-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreateTrainJourneyDetail" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "trainNumber" INTEGER NOT NULL,
    "Departure" TEXT NOT NULL,
    "Arrival" TEXT NOT NULL,
    "TotalSeats" TEXT NOT NULL,
    "NumbersofClasses" INTEGER NOT NULL,
    "Classes" TEXT[],
    "NumberofSeats" INTEGER[],
    "PricesofSeats" DOUBLE PRECISION[],
    "DepartureTiming" TIMESTAMP(3) NOT NULL,
    "ArrivalTiming" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreateTrainJourneyDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketDetails" (
    "id" SERIAL NOT NULL,
    "PNRNumber" INTEGER NOT NULL,
    "NameOfTrain" TEXT NOT NULL,
    "TrainNumber" INTEGER NOT NULL,
    "Arrival" TEXT NOT NULL,
    "Departure" TEXT NOT NULL,
    "DepartureTiming" TIMESTAMP(3) NOT NULL,
    "ArrivalTiming" TIMESTAMP(3) NOT NULL,
    "SeatNumber" INTEGER NOT NULL,
    "SeatPrice" DOUBLE PRECISION NOT NULL,
    "Class" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TicketDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TicketDetails" ADD CONSTRAINT "TicketDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
