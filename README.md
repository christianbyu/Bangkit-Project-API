# Bangkit-Project-API

Welcome to Bangkit Project Team CH2-PS135 
Detector for Agriculture System in Hydroponics based on (IoT)

## Tech Stack
```
NodeJS v16.20.0
```
```
Mysql 8.0
```

## How to Run Aplication
- Install Dependencies
```
./install.sh
```
- Run Aplication Command
```
npm run start
```

## Database Table 
```
/database/query.sql
```

## API Testing
```
curl --location 'http://API_URL/update' --header 'Content-Type: application/json' --data '{
    "date": "2023-01-02 12:11:00",
    "ph": 7.5,
    "vol": 7.7
}'
```
