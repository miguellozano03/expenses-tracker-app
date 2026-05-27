from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env', env_file_encoding='utf-8'
    )
    
    api_name: str = "Expenses Tracker API"
    api_version: str = "1.0"
    
    # Database
    postgres_user: str
    postgres_password: str
    postgres_db: str
    database_url: str
    
    # jwt
    
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    refresh_token_expire_days: int = 7
    
    # cors
    
    cors_origins: list[str] = []
    
    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors(cls, v):
        if isinstance(v, str):
            v = v.strip().strip("[]")
            return [i.strip().strip('"').strip("'") for i in v.split(",")]
        return v
    
    # rate limiter
    register_rate_limit: str = "5/minute"
    login_rate_limit: str = "5/minute"
    refresh_rate_limit: str = "20/minute"
    
settings = Settings() # type: ignore