from orjson import dumps, loads, OPT_INDENT_2
from pydantic import BaseModel
from os import urandom
from typing import Optional


class MongoDBConfig(BaseModel):
    uri: str = "mongodb://username:password@example.com/hspc"
    db_name: str = "hspc"
    use_tls: bool = False
    tls_cafile: Optional[str] = None


class DiscordConfig(BaseModel):
    bot_token: str = ""
    custom_id: str = urandom(4).hex()
    redirect_uri: str = ""
    client_id: str = ""
    client_secret: str = ""
    admin_list: list[str] = []


class Config(BaseModel):
    host: str = "0.0.0.0"
    port: int = 8080
    jwt_key: str = urandom(16).hex()
    allow_origins: list[str] = []
    mongodb_config: MongoDBConfig = MongoDBConfig()
    discord_config: DiscordConfig = DiscordConfig()


if __name__ == "config":
    try:
        with open("config.json", "rb") as config_file:
            config = Config(**loads(config_file.read()))
    except:
        config = Config()

    HOST = config.host
    PORT = config.port
    JWT_KEY = config.jwt_key
    ORIGINS = config.allow_origins

    MONGODB_URI = config.mongodb_config.uri
    MONGODB_DB = config.mongodb_config.db_name
    MONGODB_TLS = config.mongodb_config.use_tls
    MONGODB_CAFILE = config.mongodb_config.tls_cafile

    DISCORD_BOT_TOKEN = config.discord_config.bot_token
    DISCORD_CUSTOM_ID = config.discord_config.custom_id
    DISCORD_REDIRECT_URI = config.discord_config.redirect_uri
    DISCORD_CLIENT_ID = config.discord_config.client_id
    DISCORD_CLIENT_SECRET = config.discord_config.client_secret
    DISCORD_ADMIN_LIST = config.discord_config.admin_list

    with open("config.json", "wb") as config_file:
        config_file.write(dumps(config.model_dump(), option=OPT_INDENT_2))
