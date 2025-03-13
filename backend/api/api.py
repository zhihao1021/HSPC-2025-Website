from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import Config, Server

from asyncio import get_running_loop
from contextlib import asynccontextmanager

from bot import run_bot
from config import HOST, ORIGINS, PORT

from .routers import (
    member_router,
    oauth_router,
    team_router
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    loop = get_running_loop()
    task = loop.create_task(run_bot(), name="Discord Bot")

    yield

    if not task.done():
        task.cancel()

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(member_router)
app.include_router(oauth_router)
app.include_router(team_router)


async def run_api():
    config = Config(
        app=app,
        host=HOST,
        port=PORT,
        timeout_graceful_shutdown=5
    )
    server = Server(config=config)

    await server.serve()
