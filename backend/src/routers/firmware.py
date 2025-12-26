from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse
from ..models.track import Track
from ..models.robot import RobotConfig
from ..models.firmware import FirmwareConfig
from ..services.firmware_service import FirmwareService

router = APIRouter()

@router.post("/generate", response_model=FirmwareConfig)
async def generate_firmware(track: Track, robot: RobotConfig):
    """Generate firmware based on track and robot configuration"""
    try:
        firmware = FirmwareService.generate_firmware(track, robot)
        return firmware
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/generate/code", response_class=PlainTextResponse)
async def generate_firmware_code(track: Track, robot: RobotConfig):
    """Generate firmware code only (as plain text for download)"""
    try:
        firmware = FirmwareService.generate_firmware(track, robot)
        return firmware.code
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/strategy")
async def generate_strategy(track: Track, robot: RobotConfig):
    """Generate speed and PID strategy without full firmware"""
    try:
        strategy = FirmwareService.generate_speed_strategy(track, robot)
        return {
            "segments": strategy,
            "total_segments": len(strategy)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
