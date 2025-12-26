// LineFollowerOS Base Template for Arduino
// This is a template file - use the web interface to generate custom firmware

#ifndef LINE_FOLLOWER_H
#define LINE_FOLLOWER_H

#include <Arduino.h>

class LineFollower {
private:
    // Configuration
    int numSensors;
    int* sensorPins;
    int* sensorValues;
    
    // Motor pins
    int motorLeftPin1, motorLeftPin2;
    int motorRightPin1, motorRightPin2;
    
    // PID variables
    float Kp, Ki, Kd;
    int lastError;
    int integral;
    
    // Speed settings
    int baseSpeed;
    int maxSpeed;
    
public:
    LineFollower(int numSensors, int* sensorPins, 
                 int mL1, int mL2, int mR1, int mR2);
    
    void begin();
    void setPID(float kp, float ki, float kd);
    void setSpeed(int base, int max);
    void readSensors();
    int calculatePosition();
    int calculatePID(int position);
    void setMotorSpeeds(int leftSpeed, int rightSpeed);
    void run();
    void stop();
};

#endif
