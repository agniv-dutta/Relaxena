from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Relaxena API"
    environment: Literal["development", "staging", "production"] = "development"
    debug: bool = True

    secret_key: str = "change-this-in-production"
    access_token_expire_minutes: int = 60

    sqlite_db_path: str = "./relaxena.db"
    redis_url: str = "redis://localhost:6379/0"

    crowd_alert_density_threshold: float = Field(default=0.85, ge=0.0, le=1.0)
    auto_create_tables: bool = True

    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])

    @property
    def sqlalchemy_database_uri(self) -> str:
        return f"sqlite+aiosqlite:///{self.sqlite_db_path}"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
