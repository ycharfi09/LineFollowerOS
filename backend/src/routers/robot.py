from fastapi import APIRouter, HTTPException
from ..models.robot import RobotConfig

router = APIRouter()

@router.post("/validate")
async def validate_robot(robot: RobotConfig):
    """Validate robot configuration"""
    try:
        # Basic validation
        if robot.base_speed > robot.max_speed:
            return {
                "valid": False,
                "message": "Base speed cannot exceed max speed"
            }
        
        if robot.sensors.count < 2:
            return {
                "valid": False,
                "message": "At least 2 sensors are required"
            }
        
        return {
            "valid": True,
            "message": "Robot configuration is valid"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/test")
async def test_robot(robot: RobotConfig):
    """Test robot configuration and return estimated performance"""
    try:
        return {
            "robot_name": robot.name,
            "platform": robot.platform,
            "estimated_max_speed_mps": (robot.wheels.diameter * 3.14159 * robot.motor_left.max_rpm) / 60000,
            "sensor_coverage_mm": robot.sensors.count * robot.sensors.spacing,
            "pid_response": "stable" if robot.pid.kd > 0 else "may oscillate"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
