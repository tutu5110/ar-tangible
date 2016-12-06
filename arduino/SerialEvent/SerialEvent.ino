#include <Servo.h>
String inputString = "";         // a string to hold incoming data
boolean stringComplete = false;  // whether the string is complete
int pos = 0;    // variable to store the servo position
Servo myservo;

void setup() {
  // initialize serial:
  Serial.begin(115200);
  // important make it fast
  Serial.setTimeout(100);
  myservo.attach(9);
}

void loop() {
  // print the string when a newline arrives:

}

/*
  SerialEvent occurs whenever a new data comes in the
 hardware serial RX.  This routine is run between each
 time loop() runs, so using delay inside loop can delay
 response.  Multiple bytes of data may be available.
 */
void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    inputString = Serial.readStringUntil('\n');
    pos = inputString.toInt();
    inputString = "";
    myservo.write(pos); 
     delay(20);
  }
  delay(10);
}

