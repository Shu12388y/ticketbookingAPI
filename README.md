# Train Ticket Booking System

This is a sample **Train Ticket Booking System** built using **Express**, **Redis**, and **PostgreSQL**. The system allows users to book tickets for trains, view available trains, and manage ticket booking processes.

## Features

- **Train Listing**: View available trains and their details like departure, arrival, and timings.
- **Ticket Booking**: Book tickets for available trains, specifying the class and the number of seats.
- **Redis Integration**: Redis is used for real-time seat availability and to manage train data cache.
- **PostgreSQL Integration**: PostgreSQL stores user data, ticket details, and train journey information.
- **Unique PNR Number**: Each booking is assigned a unique PNR number for tracking.
- **Seat Allocation**: Dynamic seat allocation based on the class and number of seats available.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **ORM**: Prisma for PostgreSQL
- **Authentication**: JWT-based authentication for secure access
- **Environment Variables**: dotenv for configuration management

## Installation

Follow these steps to set up the project on your local machine.

### Prerequisites

- Node.js (>=14.x.x)
- PostgreSQL
- Redis
- Prisma CLI

### Step 1: Clone the repository

```bash
git clone https://github.com/yourusername/train-ticket-booking-system.git
cd train-ticket-booking-system
```

### Step 2: Install dependency
```
npm install
```

### Step 3: Run the code in local
```
npm run build
npm run start
```


## Endpoints
- User SignUp
   ```
   https://ticketbookingapi.onrender.com/usersignup
  - API BODY
   {
    "username":"shubham",
    "email":"spl.sp123@gmail.com",
    "password":"123456"
  }   
  ```
- User SignIn
```
https://ticketbookingapi.onrender.com/usersignin
  - API BODY
  {
    "email":"spl.sp123@gmail.com",
    "password":"123456"
  }
```
- Admin SignUp
```
https://ticketbookingapi.onrender.com/adminsignup
- API BODY 
{
    "email":"admin01@gmail.com",
    "password":"admin1234"
}
```

- Admin SignIn
```
https://ticketbookingapi.onrender.com/adminsignup
- API BODY
{
  "email":"admin01@gmail.com",
  "password":"admin1234"
}
```

- Create Train List 
```
https://ticketbookingapi.onrender.com/admin/createtrainlist

-API HEADER
{
  apikey:'11234'
}

- API BODY 
  {
    "name": "FGY Express",
  "trainNumber": 69890,
  "Departure": "Jamshedpur",
  "Arrival": "New Delhi",
  "TotalSeats": "500",
  "NumbersofClasses": 3,
  "Classes": ["Economy", "Business", "First Class"],
  "NumberofSeats": [300, 150, 50],
  "PricesofSeats": [50.0, 100.0, 200.0],
  "DepartureTiming": "2024-12-10T09:30:00Z",
  "ArrivalTiming": "2024-12-10T14:30:00Z"
  }
```

- Update Train List
```
https://ticketbookingapi.onrender.com/admin/updatetrainlist/{trainid}

API HEADER:
  {
    apikey:'1234'
  }

API BODY:
  {
  "name": "FGY Express",
  "trainNumber": 69890,
  "Departure": "Jamshedpur",
  "Arrival": "New Delhi",
  "TotalSeats": "500",
  "NumbersofClasses": 3,
  "Classes": ["Economy", "Business", "First Class"],
  "NumberofSeats": [300, 150, 50],
  "PricesofSeats": [50.0, 100.0, 200.0],
  "DepartureTiming": "2024-12-10T09:30:00Z",
  "ArrivalTiming": "2024-12-10T14:30:00Z"

  }

```

- Delete Train List
```
https://ticketbookingapi.onrender.com/admin/deletetrainlist/{trainid}

API HEADER:
  {
    apikey:'1234'
  }

```


- Search Trains 
```
https://ticketbookingapi.onrender.com/searchtrain?Arrival=New Delhi&Departure=Jamshedpur

- API HEADER:
  {
    authtoken:'12345'
  }


- API RESPONSE: 
{
    "data": [
        {
            "id": 7,
            "name": "Ranjdhai Express",
            "trainNumber": 12345,
            "Departure": "Jamshedpur",
            "Arrival": "New Delhi",
            "NumbersofClasses": 3,
            "PricesofSeats": [
                50,
                100,
                200
            ],
            "DepartureTiming": "2024-12-10T09:30:00.000Z",
            "ArrivalTiming": "2024-12-10T14:30:00.000Z",
            "classesWithSeats": [
                {
                    "class": "Economy",
                    "numberofSeats": "190"
                },
                {
                    "class": "Business",
                    "numberofSeats": "N/A"
                },
                {
                    "class": "First Class",
                    "numberofSeats": "50"
                }
            ]
        },
        {
            "id": 8,
            "name": "ABC Express",
            "trainNumber": 67890,
            "Departure": "Jamshedpur",
            "Arrival": "New Delhi",
            "NumbersofClasses": 3,
            "PricesofSeats": [
                50,
                100,
                200
            ],
            "DepartureTiming": "2024-12-10T09:30:00.000Z",
            "ArrivalTiming": "2024-12-10T14:30:00.000Z",
            "classesWithSeats": [
                {
                    "class": "Economy",
                    "numberofSeats": "300"
                },
                {
                    "class": "Business",
                    "numberofSeats": "150"
                },
                {
                    "class": "First Class",
                    "numberofSeats": "50"
                }
            ]
        },
        {
            "id": 9,
            "name": "FGY Express",
            "trainNumber": 69890,
            "Departure": "Jamshedpur",
            "Arrival": "New Delhi",
            "NumbersofClasses": 3,
            "PricesofSeats": [
                50,
                100,
                200
            ],
            "DepartureTiming": "2024-12-10T09:30:00.000Z",
            "ArrivalTiming": "2024-12-10T14:30:00.000Z",
            "classesWithSeats": [
                {
                    "class": "Economy",
                    "numberofSeats": "300"
                },
                {
                    "class": "Business",
                    "numberofSeats": "150"
                },
                {
                    "class": "First Class",
                    "numberofSeats": "50"
                }
            ]
        }
    ]
}
```



- Book Train 
```
https://ticketbookingapi.onrender.com/service/book/{trainnumber}

API HEADER:
  {
  authtoken:'123456'
  }

API BODY:
  {
    "Class":"Economy",
    "numberOfSeats":2
  }

API RESPONSE:
{
    "message": "Tickets booked successfully",
    "tickets": [
        {
            "id": 7,
            "PNRNumber": 462377,
            "NameOfTrain": "Ranjdhai Express",
            "TrainNumber": 12345,
            "Arrival": "New Delhi",
            "Departure": "Jamshedpur",
            "DepartureTiming": "2024-12-10T09:30:00.000Z",
            "ArrivalTiming": "2024-12-10T14:30:00.000Z",
            "SeatNumber": 138,
            "SeatPrice": 50,
            "Class": "Economy",
            "userId": 1
        },
        {
            "id": 8,
            "PNRNumber": 647077,
            "NameOfTrain": "Ranjdhai Express",
            "TrainNumber": 12345,
            "Arrival": "New Delhi",
            "Departure": "Jamshedpur",
            "DepartureTiming": "2024-12-10T09:30:00.000Z",
            "ArrivalTiming": "2024-12-10T14:30:00.000Z",
            "SeatNumber": 71,
            "SeatPrice": 50,
            "Class": "Economy",
            "userId": 1
        }
    ]
}




