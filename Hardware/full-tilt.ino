void setup() {
    pinMode(A5, INPUT);
    Particle.function("record", collectData);
    Serial.begin(9600);
}

int collectData(String x)
{
    String data = "";
    for(int i = 0; i<250; i++){
        int point = analogRead(A5);
        if(point > 3000){
            data += "1";
        }
        else{
            data += "0";
        }
        delay(120);
    }
    Particle.publish("new-data", data);
    return 0;
}

void loop() {
    Serial.println(analogRead(A5));
    delay(120);
}
