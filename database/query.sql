/* Query to Create DATABASE */
CREATE DATABASE ph_staging;
USE ph_staging;

/* Table API */
CREATE TABLE sensor_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date VARCHAR(255),
    ph VARCHAR(255),
    vol VARCHAR(255)
);

/* Table User for Login */
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

/* Change Date and Timezone to Jakarta */
SET time_zone = 'Asia/Jakarta';
SET time_zone = "+07:00";
SET @@session.time_zone = "+07:00";

/* Check Date and Time Zone */
SELECT NOW(); 
SELECT @@session.time_zone;
