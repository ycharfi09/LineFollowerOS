// LineFollowerOS Base Template for Arduino
// Implementation

#include "LineFollower.h"

LineFollower::LineFollower(int numSensors, int* sensorPins,
                           int mL1, int mL2, int mR1, int mR2) {
    this->numSensors = numSensors;
    this->sensorPins = sensorPins;
    this->sensorValues = new int[numSensors];
    
    this->motorLeftPin1 = mL1;
    this->motorLeftPin2 = mL2;
    this->motorRightPin1 = mR1;
    this->motorRightPin2 = mR2;
    
    this->lastError = 0;
    this->integral = 0;
    this->baseSpeed = 150;
    this->maxSpeed = 200;
    this->Kp = 1.0;
    this->Ki = 0.0;
    this->Kd = 0.5;
}

void LineFollower::begin() {
    Serial.begin(9600);
    
    // Initialize motor pins
    pinMode(motorLeftPin1, OUTPUT);
    pinMode(motorLeftPin2, OUTPUT);
    pinMode(motorRightPin1, OUTPUT);
    pinMode(motorRightPin2, OUTPUT);
    
    // Initialize sensor pins
    for (int i = 0; i < numSensors; i++) {
        pinMode(sensorPins[i], INPUT);
    }
    
    Serial.println("LineFollower initialized!");
}

void LineFollower::setPID(float kp, float ki, float kd) {
    this->Kp = kp;
    this->Ki = ki;
    this->Kd = kd;
}

void LineFollower::setSpeed(int base, int max) {
    this->baseSpeed = base;
    this->maxSpeed = max;
}

void LineFollower::readSensors() {
    for (int i = 0; i < numSensors; i++) {
        sensorValues[i] = digitalRead(sensorPins[i]);
    }
}

int LineFollower::calculatePosition() {
    int sum = 0;
    int count = 0;
    
    for (int i = 0; i < numSensors; i++) {
        if (sensorValues[i] == HIGH) {
            sum += i * 1000;
            count++;
        }
    }
    
    if (count == 0) return -1;
    return sum / count - ((numSensors - 1) * 500);
}

int LineFollower::calculatePID(int position) {
    if (position == -1) return 0;
    
    int error = position;
    integral += error;
    int derivative = error - lastError;
    lastError = error;
    
    // Prevent integral windup
    integral = constrain(integral, -1000, 1000);
    
    int correction = (Kp * error) + (Ki * integral) + (Kd * derivative);
    return correction;
}

void LineFollower::setMotorSpeeds(int leftSpeed, int rightSpeed) {
    // Left motor
    if (leftSpeed >= 0) {
        analogWrite(motorLeftPin1, leftSpeed);
        analogWrite(motorLeftPin2, 0);
    } else {
        analogWrite(motorLeftPin1, 0);
        analogWrite(motorLeftPin2, -leftSpeed);
    }
    
    // Right motor
    if (rightSpeed >= 0) {
        analogWrite(motorRightPin1, rightSpeed);
        analogWrite(motorRightPin2, 0);
    } else {
        analogWrite(motorRightPin1, 0);
        analogWrite(motorRightPin2, -rightSpeed);
    }
}

void LineFollower::run() {
    readSensors();
    int position = calculatePosition();
    int correction = calculatePID(position);
    
    int leftSpeed = constrain(baseSpeed + correction, 0, maxSpeed);
    int rightSpeed = constrain(baseSpeed - correction, 0, maxSpeed);
    
    setMotorSpeeds(leftSpeed, rightSpeed);
}

void LineFollower::stop() {
    setMotorSpeeds(0, 0);
}
