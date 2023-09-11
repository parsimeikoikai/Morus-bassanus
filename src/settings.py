from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    aws_key_id: Optional[str] = None
    aws_secret_key: Optional[str] = None
    aws_session_token: Optional[str] = None
    openai_api_key: str
    model_config = SettingsConfigDict(env_file='.env')


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()