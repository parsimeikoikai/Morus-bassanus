from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict



class Settings(BaseSettings):
    aws_key_id: str
    aws_secret_key: str
    aws_session_token: str
    openai_api_key: str
    model_config = SettingsConfigDict(env_file='.env')


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()