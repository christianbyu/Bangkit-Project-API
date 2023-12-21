#include <Wire.h>
#include <KRwifi.h>

char* ssid = "WIFI_SSID";
char* pass = "WIFI_PASSWORD";
const char* server = "SERVER_IP";
const char* APIKey = "/API_PATH";

#define SensorPin A0      //pH meter Analog output to Arduino Analog Input 0
float calibration_value = 21.34 + 0.7;
unsigned long int avgValue; 
int buf[10], temp;

uint32_t periodeKirim   = 20000;
uint32_t millisKirim;

const int EMPTY_SENSOR_VALUE = 100;
const int FULL_SENSOR_VALUE = 800;
const int MAX_WATER_LEVEL = 500;
int count;
void setup() {
  pinMode(SensorPin, INPUT);

  Serial.begin(9600);
  setWifi(ssid, pass);
//  connectWiFi();
  millisKirim = millis();
}

void loop() {
  // pH sensor part
  for (int i = 0; i < 10; i++) {
    buf[i] = analogRead(SensorPin);
    delay(10);
  }

  for (int i = 0; i < 9; i++) {
    for (int j = i + 1; j < 10; j++) {
      if (buf[i] > buf[j]) {
        temp = buf[i];
        buf[i] = buf[j];
        buf[j] = temp;
      }
    }
  }

  avgValue = 0;
  for (int i = 2; i < 8; i++) avgValue += buf[i];  //take the average value of 6 center sample

  float ph = (float)avgValue * 5.0 / 1024 / 6; //convert the analog into millivolt
  ph = -5.70 * ph + calibration_value; //convert the millivolt into pH value

//  Serial.setCursor(0, 0);
  Serial.println("pH Value: ");
  Serial.print(ph);
  Serial.print("  ");

  // Water level sensor part
  int value = analogRead(A1);
  int waterLevel = map(value, EMPTY_SENSOR_VALUE, FULL_SENSOR_VALUE, 0, MAX_WATER_LEVEL);
  float vol = map(float(waterLevel), 0, MAX_WATER_LEVEL, 0, 100);

//  Serial.setCursor(0, 1);
  Serial.print("Volume :");
  Serial.print(vol);
  Serial.print("mL");

//  postData();
  if (millisKirim < millis()) {
    millisKirim = millis() + periodeKirim;
    count++;
    String konten;
    konten = String() + "phValue=" + ph +  "&tinggi=" + vol;
    httpPOST(server, APIKey, konten, 50, 80);
    Serial.print("Respon: ");
    Serial.println(getData);
  delay(1000);
}
  statusPengiriman();
}