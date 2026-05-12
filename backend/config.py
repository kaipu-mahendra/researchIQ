from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    anthropic_api_key: str = Field(..., env="ANTHROPIC_API_KEY")
    cors_origins: str = Field("http://localhost:5173", env="CORS_ORIGINS")
    upload_dir: str = Field("uploads", env="UPLOAD_DIR")
    max_file_size_mb: int = Field(50, env="MAX_FILE_SIZE_MB")
    embed_model: str = "all-MiniLM-L6-v2"
    chunk_size: int = 512
    chunk_overlap: int = 64
    top_k: int = 8
    claude_model: str = "claude-sonnet-4-20250514"

    class Config:
        env_file = ".env"

settings = Settings()
