from functools import lru_cache
from pathlib import Path
from typing import Annotated
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[2] / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Relaxena"
    environment: Literal["development", "staging", "production"] = "development"
    debug: bool = True

    secret_key: str = "change-this-in-production"
    jwt_secret_key: str = "change-this-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 30

    database_url: str | None = None
    sqlite_db_path: str = "./relaxena.db"

    crowd_alert_density_threshold: float = Field(default=0.85, ge=0.0, le=1.0)
    auto_create_tables: bool = True

    cors_origins: Annotated[list[str], NoDecode] = Field(default_factory=lambda: ["http://localhost:3000"])

    groq_api_key: str | None = None
    groq_model: str = "llama3-70b-8192"
    groq_fallback_model: str = "mixtral-8x7b-32768"

    openweather_api_key: str | None = None
    sportsdata_api_key: str | None = None

    twilio_account_sid: str | None = None
    twilio_auth_token: str | None = None
    twilio_phone_number: str | None = None

    from_email: str = "alerts@relaxena.io"

    ai_chat_history_ttl_seconds: int = 7200
    ai_predict_cache_ttl_seconds: int = 300

    @property
    def sqlalchemy_database_uri(self) -> str:
        if self.database_url:
            return self.database_url
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
