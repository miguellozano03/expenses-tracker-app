from pydantic_settings import BaseSettings, SettingsConfigDict

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
    
settings = Settings() # type: ignore