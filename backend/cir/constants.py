import os

from typing import Optional
from pathlib import Path

def getenv_checked(env_name: str) -> str:
    env = os.getenv(env_name)
    if env is None:
        raise ValueError(f"Environment variable {env_name} must be defined.")
    else:
        return env

try:
    RNGSEED: Optional[int] = int(getenv_checked("RNGSEED"))
except:
    RNGSEED = None
COEFDATAFILE: Path = Path(getenv_checked("COEFDATAFILE"))
FRONTEND_URL = getenv_checked("FRONTEND_URL")
